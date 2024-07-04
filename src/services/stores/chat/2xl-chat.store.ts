import { Alert } from 'react-native';
import { shallow } from 'zustand/shallow';
import { t } from 'i18next';
import { createWithEqualityFn } from 'zustand/traditional';
import RNFS from 'react-native-fs';
import base64 from 'react-native-base64';
import * as FileSystem from 'expo-file-system';
import { uploadAudioFile, getCharacterVersion, getAudio, getText, closeAudio, getModeration } from '../../../api/vox.api';
import { AUDIO_CHARACTERISTICS, useBleStore } from '../ble/ble.store';
import { ChatState, initialState } from './chat.types';
import { addWavHeader, sleep } from '../../utils/audio.utils';
import { useActiveProfileStore } from '../profile.store';
import { queryClient } from '../../../../config';
import { AccountPreferences } from '../../../api/vox.types';
import { preferencesQueryKey } from '../../../hooks/preferences';
import { displayVexelsAlert } from '../user.store';
import { extraConsoleDetails } from '../../../../config';
import { useUserStore } from '../user.store';

export const use2XLChatStore = createWithEqualityFn<ChatState>((set, get) => {
  const { toggleRecording, playAudio, startFiller, stopAudio, displayEmotion } = useBleStore.getState();

  async function startRecording(shouldDisplay: boolean) {
    set({ isRecording: true });
    await toggleRecording(true);

    if (shouldDisplay) {
      displayEmotion('LISTEN');
    }
  }

  async function stopRecording(shouldPlayback = true) {
    // console.log('stopRecording', new Date());
    const { activeProfile } = useActiveProfileStore.getState();

    const { isRecording } = get();

    if (!isRecording) {
      return;
    }

    set({ isRecording: false });

    try {
      const { pcmPackets } = await toggleRecording(false);

      if (!shouldPlayback) {
        return;
      }

      startLoading();

      const wav = addWavHeader(pcmPackets);
      const data = base64.encodeFromByteArray(new Uint8Array(wav));

      const path = FileSystem.documentDirectory + '2xl-recording.wav';
      await RNFS.writeFile(path, data, 'base64');

      // console.log('------------wav file written:', new Date(), path, data.length);

      const { audio_id, text } = await uploadAudioFile(
        path,
        activeProfile?.id as string,
        getCharacterVersion(activeProfile?.selected_character)
      );

      // console.log('------------uploaded:', new Date(), audio_id);

      set(({ messages }) => ({
        messages: [...messages, { text, role: 'user' } as const],
      }));

      await playSound(audio_id);
    } catch (err) {
      if ((err as any)?.status === 402) {
        displayVexelsAlert();
      }else if ((err as any)?.status === 404) {
        const message = (err as any)?.data?.message || 'There was a 404 ERROR';
        if (extraConsoleDetails) console.log('2xl-chat.store.ts: stopRecording() (err) [404] error');
        Alert.alert(message);
      } else {
        const message = (err as any)?.data?.message || 'There was a problem';
        if (extraConsoleDetails) console.log('2xl-chat.store.ts: stopRecording() (err) OTHER error');
        Alert.alert(message);
      }
      console.error({ err });
      reset();
    }
  }

  async function playSound(audioId: string) {
    const { activeProfile } = useActiveProfileStore.getState();

    const profileId = activeProfile?.id as string;
    const characterVersion = getCharacterVersion(activeProfile?.selected_character);

    try {
      const uri = await getAudio(audioId, profileId, characterVersion, AUDIO_CHARACTERISTICS.SERVER_FORMAT);

      const initialPromise = new Promise<void>((resolve, reject) => {
        // console.log('------------start: ', new Date(), ' ------------------', uri);
        const sokcetUri = uri.replace('https', 'wss').replace('sts/audio/', 'sts/audio/ws/');
        const ws = new WebSocket(sokcetUri);

        let websocketClosed = false;
        let isResponseAppropriate: boolean | undefined;
        if (audioId === '1') {
          isResponseAppropriate = true;
        } else {
          // sleep(10_000).then(() => {
          getModeration(profileId, characterVersion, audioId).then(async response => {
            isResponseAppropriate = !response.triggered;

            if (!isResponseAppropriate) {
              ws.close();
              await playSound('1');
              resolve();
            } else if (websocketClosed) {
              startPlayingAudio();
            }
          });
          // });
        }

        function startPlayingAudio() {
          startTalking();
          audioResponsePlay = playAudio(buffer, { streaming: !websocketClosed, emotion: 'TALK' });
          audioResponsePlay.run().then(resolve);
        }

        let isFirstMessage = true;
        let buffer: number[] = [];
        let limit: number = AUDIO_CHARACTERISTICS.BUFFER_START;
        let audioResponsePlay: { addAudio: (data: number[]) => void; stop: (hard?: boolean) => void; run: () => Promise<void> };

        async function proceedAudioBuffer() {
          if (buffer.length === 0) return;

          if (audioResponsePlay) {
            audioResponsePlay.addAudio(buffer);
            buffer.length = 0;
          } else if (isResponseAppropriate) {
            startPlayingAudio();
            buffer.length = 0;
          }
        }

        ws.onmessage = event => {
          if (isResponseAppropriate === false) {
            return;
          }

          if (isFirstMessage) {
            console.log('firstmessage', new Date());
            stopLoading();
            isFirstMessage = false;
          }

          const data = new Uint8Array(event.data);
          // console.log(audioId, new Date(), data.length);
          for (let i = 0, ii = data.length; i < ii; i++) {
            buffer.push(data[i]);
          }

          if (buffer.length >= limit) {
            limit = 0;

            proceedAudioBuffer();
          }
        };
        ws.onerror = event => {
          console.error('error', new Date(), { event });
          ws.close();
          reject('Socket problem!!!');
        };
        ws.onclose = () => {
          websocketClosed = true;
          proceedAudioBuffer();
          audioResponsePlay?.stop();
          // console.log('close', new Date());
        };
      });

      await initialPromise;

      // console.log('resolve initialPromise');

      stopTalking();

      const { isVadEnabled } = useBleStore.getState();

      if (isVadEnabled) {
        sleep(500).then(() => startRecording(false));
      }

      getText(profileId, characterVersion, audioId)
        .then(reply => {
          set(({ messages }) => ({
            messages: [...messages, { text: reply.assistant, role: 'assistant' } as const],
          }));
        })
        .finally(() => closeAudio(profileId, characterVersion, audioId));
    } catch (err) {
      const message = (err as any)?.data?.message || 'There was a problem';
      Alert.alert(message);
      console.error({ err });
      reset();
    }
  }

  function startTalking() {
    set({ isTalking: true });
  }

  function stopTalking() {
    set({ isTalking: false });
    displayEmotion('IDLE');
  }

  function startLoading() {
    const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
    const { activeProfile } = useActiveProfileStore.getState();
    const language = activeProfile?.characters?.[activeProfile.selected_character as string].language ?? 'en-US';

    set({ isLoading: true });
    startFiller(preferences?.['2xl:hasInsightFiller'] ?? true, preferences?.['2xl:hasThinkingFiller'] ?? true, language);
    if (extraConsoleDetails) console.log('2xl-chat.store.ts: startLoading(): Filler is playing');
  }

  function stopLoading() {
    set({ isLoading: false });
    stopAudio();
  }

  function reset() {
    console.log('chat reset');
    stopLoading();
    stopRecording();
    stopTalking();
    set(initialState);
  }

  return {
    ...initialState,
    startRecording,
    stopRecording,
    reset,
  };
}, shallow);
