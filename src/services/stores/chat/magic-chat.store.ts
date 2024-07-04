import { Audio } from 'expo-av';
import { AndroidOutputFormat, AndroidAudioEncoder, IOSOutputFormat, IOSAudioQuality } from 'expo-av/build/Audio';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { uploadAudioFile, getCharacterVersion, getAudio, getText, tti, closeAudio, getModeration } from '../../../api/vox.api';
import { ChatState, emptyCharacter, initialState } from './chat.types';
import { useActiveProfileStore } from '../profile.store';
import { Alert } from 'react-native';
import { extraConsoleDetails } from '../../../../config';
import Message from '../../vad/Message';

export const useMagicChatStore = createWithEqualityFn<ChatState>((set, get) => {
  let recording: Audio.Recording | undefined;
  let soundRef = new Audio.Sound();

  soundRef.setOnPlaybackStatusUpdate(status => {
    if (status.isLoaded && status.didJustFinish) {
      set({ isTalking: false });
    }
  });

  async function startRecording() {
    set({ isRecording: true });

    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: rec } = await Audio.Recording.createAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: AndroidOutputFormat.MPEG_4,
          audioEncoder: AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: IOSOutputFormat.LINEARPCM,
          audioQuality: IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      recording = rec;
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }

    set({ isRecording: false });
    const { activeProfile } = useActiveProfileStore.getState();

    try {
      set({ isLoading: true });
      console.log('Stopping recording..');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      const { audio_id, text } = await uploadAudioFile(
        uri as string,
        activeProfile?.id as string,
        getCharacterVersion(activeProfile?.selected_character)
      );

      set(({ messages }) => ({
        messages: [...messages, { text: text || emptyCharacter, role: 'user' } as const],
      }));

      await playSound(audio_id);
    } catch (err) {
//      Alert.alert('Error uploading audio', err as string);
//      Alert.alert('Error uploading audio', err as Message);
      if (extraConsoleDetails) console.log('Stopped recording and error is being thrown');
      console.error(err);
    } finally {
      set({ isLoading: false });
      recording = undefined;
    }
  }

  async function playSound(audioId: string) {
    stopSound();
    const { activeProfile } = useActiveProfileStore.getState();

    const profileId = activeProfile?.id as string;
    const characterVersion = getCharacterVersion(activeProfile?.selected_character);

    try {
      const uri = await getAudio(audioId, profileId, characterVersion, 'mp3_22050_32');

      await soundRef.loadAsync({
        uri,
      });

      await soundRef.playAsync();
      set({ isTalking: true });

      const reply = await getText(profileId, characterVersion, audioId);
      set(({ messages }) => ({
        messages: [...messages, { text: reply.assistant, role: 'assistant' } as const],
      }));

      // TODO: call moderation earlier
      getModeration(profileId, characterVersion, audioId).finally(() => {
        // Cleanup server!
        closeAudio(profileId, characterVersion, audioId);
      });

      if (reply.id) {
        const userEntries = get().messages.filter(message => message.role === 'user' && message.text !== emptyCharacter);
        if (userEntries.length % 3 === 1) {
          const imageUri = await tti(profileId, characterVersion);

          set(({ messages }) => ({
            messages: [...messages, { imageUri, role: 'image' } as const],
          }));
        }
      }
    } catch (err) {
      Alert.alert('Error playing audio', err as string);
      console.error(err);
      stopSound();
      set({ isTalking: false });
    }
  }

  async function stopSound() {
    set({ isTalking: false });

    try {
      await soundRef.unloadAsync();
    } catch {}
  }

  function reset() {
    stopRecording();
    stopSound();
    set(initialState);
  }

  return {
    ...initialState,
    startRecording,
    stopRecording,
    reset,
  };
}, shallow);
