import { queryClient } from '../../../../config';
import { getAdHocAudio, getCharacters, updateMyPreferences, updateProfileCharacter } from '../../../api/vox.api';
import { AccountPreferences, Profile, SUPPORTED_TALKING_MODES } from '../../../api/vox.types';
import {
  charactersQueryKey,
  preferencesQueryKey,
  preferencesUpdateKey,
  profileQueryKey,
  profileUpdateMutationKey,
  profilesQueryKey,
  upsert,
} from '$hooks';
import { useChatStore } from '../chat';
import { AUDIO_CHARACTERISTICS, useBleStore } from './ble.store';
import { useActiveProfileStore } from '../profile.store';
import { t } from 'i18next';
import { extraConsoleDetails } from '../../../../config';

export const buttonHandlers = [
   //-------- Top Button Section --------
  {
    position: 'top',
    pressed: false,
    onPressIn() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

      if (!preferences) {
        return;
      }

      const talkingMode = preferences['2xl:talkingMode'];
      const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
      const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

      console.log('Top button pressed in');

      if (talkingMode === 'auto') {
        if (isVadEnabled) {
          if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
          stopVad();
        } else {
          if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
          startVad();
        }
      } else {
        if (isTalking || isLoading) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
          return;
        }

        if (!isRecording) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
          startRecording(true);
        } else if (talkingMode === 'press') {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
          stopRecording();
          if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
        }
      }
    },
    onPressOut() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const talkingMode = preferences?.['2xl:talkingMode'];
      const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

      if (isTalking || isLoading) {
        return;
      }

      console.log('Top button pressed out');

      if (isRecording && talkingMode === 'push') {
        console.log('onPressOut stopRecording');
        stopRecording();
      }
    },
  },
  //-------- Left Button Section --------
  {
    position: 'left',
    pressed: false,
    onPressIn() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

      if (!preferences) {
        return;
      }

      const talkingMode = preferences['2xl:talkingMode'];
      const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
      const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

      console.log('Left button pressed in');

      if (talkingMode === 'auto') {
        if (isVadEnabled) {
          if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
          stopVad();
        } else {
          if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
          startVad();
        }
      } else {
        if (isTalking || isLoading) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
          return;
        }

        if (!isRecording) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
          startRecording(true);
        } else if (talkingMode === 'press') {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
          stopRecording();
          if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
        }
      }
    },
    onPressOut() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const talkingMode = preferences?.['2xl:talkingMode'];
      const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

      if (isTalking || isLoading) {
        return;
      }

      console.log('Left button pressed out');

      if (isRecording && talkingMode === 'push') {
        console.log('onPressOut stopRecording');
        stopRecording();
      }
    },
  },
  //-------- Right Button Section --------
  {
    position: 'right',
    pressed: false,
    onPressIn() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

      if (!preferences) {
        return;
      }

      const talkingMode = preferences['2xl:talkingMode'];
      const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
      const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

      console.log('Right button pressed in');

      if (talkingMode === 'auto') {
        if (isVadEnabled) {
          if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
          stopVad();
        } else {
          if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
          startVad();
        }
      } else {
        if (isTalking || isLoading) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
          return;
        }

        if (!isRecording) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
          startRecording(true);
        } else if (talkingMode === 'press') {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
          stopRecording();
          if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
        }
      }
    },
    onPressOut() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const talkingMode = preferences?.['2xl:talkingMode'];
      const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

      if (isTalking || isLoading) {
        return;
      }

      console.log('Right button pressed out');

      if (isRecording && talkingMode === 'push') {
        console.log('onPressOut stopRecording');
        stopRecording();
      }
    },
  },
    //-------- Bottom Button Section --------
  {
    position: 'bottom',
    pressed: false,
    onPressIn() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

      if (!preferences) {
        return;
      }

      const talkingMode = preferences['2xl:talkingMode'];
      const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
      const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

      console.log('Bottom button pressed in');

      if (talkingMode === 'auto') {
        if (isVadEnabled) {
          if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
          stopVad();
        } else {
          if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
          startVad();
        }
      } else {
        if (isTalking || isLoading) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
          return;
        }

        if (!isRecording) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
          startRecording(true);
        } else if (talkingMode === 'press') {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
          stopRecording();
          if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
        }
      }
    },
    onPressOut() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const talkingMode = preferences?.['2xl:talkingMode'];
      const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

      if (isTalking || isLoading) {
        return;
      }

      console.log('Bottom button pressed out');

      if (isRecording && talkingMode === 'push') {
        console.log('onPressOut stopRecording');
        stopRecording();
      }
    },
  },
    //-------- Center Button Section --------
  {
    position: 'center',
    pressed: false,
    onPressIn() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

      if (!preferences) {
        return;
      }

      const talkingMode = preferences['2xl:talkingMode'];
      const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
      const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

      console.log('Center button pressed in');

      if (talkingMode === 'auto') {
        if (isVadEnabled) {
          if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
          stopVad();
        } else {
          if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
          startVad();
        }
      } else {
        if (isTalking || isLoading) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
          return;
        }

        if (!isRecording) {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
          startRecording(true);
        } else if (talkingMode === 'press') {
          if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
          stopRecording();
          if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
        }
      }
    },
    onPressOut() {
      const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const talkingMode = preferences?.['2xl:talkingMode'];
      const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

      if (isTalking || isLoading) {
        return;
      }

      console.log('Center button pressed out');

      if (isRecording && talkingMode === 'push') {
        console.log('onPressOut stopRecording');
        stopRecording();
      }
    },
  },
];

/* -------- TO BRING BACK IN THE FUTURE, NOT USABLE IN MVP VERSION 1.0 --------
export const buttonHandlers = [
  //-------- Top Button Section --------
 {
   position: 'top',
   pressed: false,
   // switch talking mode
   async onPressIn() {
     console.log('Top button pressed in');
     const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey) as AccountPreferences;
     const { activeProfile } = useActiveProfileStore.getState();
     const { setIsVadEnabled, stopVad } = useBleStore.getState();

     if (!activeProfile) {
       return;
     }

     const activeTalkingModeIndex = SUPPORTED_TALKING_MODES.findIndex(talkingMode => talkingMode === preferences['2xl:talkingMode']);
     const activeTalkingMOde = SUPPORTED_TALKING_MODES[activeTalkingModeIndex];
     const nextActiveTalkingMode = SUPPORTED_TALKING_MODES?.[((activeTalkingModeIndex as number) + 1) % SUPPORTED_TALKING_MODES.length];

     console.log(`switched from ${activeTalkingMOde} to ${nextActiveTalkingMode}`);

     setIsVadEnabled(false);
     stopVad();

     const { playAudio } = useBleStore.getState();

     getAdHocAudio(t(`account.${nextActiveTalkingMode}`), activeProfile, AUDIO_CHARACTERISTICS.SERVER_FORMAT).then(data => {
       const audio = playAudio(data);
       audio.run();
     });

     queryClient
       .getMutationCache()
       .build(queryClient, {
         mutationKey: preferencesUpdateKey,
         mutationFn: updateMyPreferences,
         variables: {
           '2xl:talkingMode': nextActiveTalkingMode,
         },
         onSuccess(newPreferences) {
           queryClient.setQueryData<AccountPreferences>(preferencesQueryKey, newPreferences);
         },
       })
       .execute();
   },
 },
 //-------- Left Button Section --------
 {
   position: 'left',
   pressed: false,
   onPressIn() {
     // announce profile
     console.log('Left button pressed in');
     const { activeProfile } = useActiveProfileStore.getState();
     const { playAudio } = useBleStore.getState();

     if (!activeProfile) {
       return;
     }

     getAdHocAudio(activeProfile.name, activeProfile, AUDIO_CHARACTERISTICS.SERVER_FORMAT).then(data => {
       const audio = playAudio(data);
       audio.run();
     });
   },
 },
   //-------- Bottom Button Section --------
 {
   position: 'bottom',
   pressed: false,
   async onPressIn() {
     // switch mode
     console.log('Bottom button pressed in');

     const { activeProfile } = useActiveProfileStore.getState();
     await queryClient.prefetchQuery({
       queryKey: charactersQueryKey,
       queryFn: getCharacters,
     });

     const characters = queryClient.getQueryData<Awaited<ReturnType<typeof getCharacters>>>(charactersQueryKey);

     if (!activeProfile) {
       return;
     }

     const characterName = activeProfile.selected_character as string;
     const activeMode = activeProfile.characters?.[characterName]?.mode;
     const character = characters?.find(char => char.key === activeProfile.selected_character);
     const activeModeIndex = character?.modes.findIndex(mode => mode === activeMode);
     const nextActiveMode = character?.modes[((activeModeIndex as number) + 1) % character.modes.length] ?? 'conversation';

     if (nextActiveMode === activeMode) {
       return;
     }

     console.log(`switched from ${activeMode} to ${nextActiveMode}`);

     const { playAudio } = useBleStore.getState();

     getAdHocAudio(nextActiveMode, activeProfile, AUDIO_CHARACTERISTICS.SERVER_FORMAT).then(data => {
       const audio = playAudio(data);
       audio.run();
     });

     queryClient
       .getMutationCache()
       .build(queryClient, {
         mutationKey: profileUpdateMutationKey,
         mutationFn: data => updateProfileCharacter(activeProfile.id, characterName, data),
         variables: {
           mode: nextActiveMode,
         },
         onSuccess(data) {
           const newProfile = {
             ...data,
             characters: { ...data?.characters, [characterName]: { ...data?.characters?.[characterName], ...data } },
           } as Profile;

           queryClient.setQueryData<Profile[]>(profilesQueryKey, profiles => upsert(profiles ?? [], newProfile));
           queryClient.setQueryData([profileQueryKey, activeProfile.id], newProfile);
         },
       })
       .execute();
   },
 },
   //-------- Right Button Section --------
 {
   position: 'right',
   pressed: false,
   onPressIn() {
     // tbd
     console.log('Right button pressed in');
   },
 },
   //-------- Center Button Section --------
 {
   position: 'center',
   pressed: false,
   onPressIn() {
     const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);

     if (!preferences) {
       return;
     }

     const talkingMode = preferences['2xl:talkingMode'];
     const { startRecording, stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();
     const { isVadEnabled, startVad, stopVad } = useBleStore.getState();

     console.log('Center button pressed in');

     if (talkingMode === 'auto') {
       if (isVadEnabled) {
         if (extraConsoleDetails) console.log('Talking mode:Auto, stopVad()');
         stopVad();
       } else {
         if (extraConsoleDetails) console.log('Talking mode:Auto, startVad()');
         startVad();
       }
     } else {
       if (isTalking || isLoading) {
         if (extraConsoleDetails) console.log('TalkingMode: !Auto, isTalking||isLoading');
         return;
       }

       if (!isRecording) {
         if (extraConsoleDetails) console.log('TalkingMode: !Auto, !isRecording');
         startRecording(true);
       } else if (talkingMode === 'press') {
         if (extraConsoleDetails) console.log('TalkingMode: !Auto, talkingMode==press');
         stopRecording();
         if (extraConsoleDetails) console.log('stopRecording() from buttons.util.ts');
       }
     }
   },
   onPressOut() {
     const preferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
     const talkingMode = preferences?.['2xl:talkingMode'];
     const { stopRecording, isRecording, isTalking, isLoading } = useChatStore.getState();

     if (isTalking || isLoading) {
       return;
     }

     console.log('Center button pressed out');

     if (isRecording && talkingMode === 'push') {
       console.log('onPressOut stopRecording');
       stopRecording();
     }
   },
 },
];
*/