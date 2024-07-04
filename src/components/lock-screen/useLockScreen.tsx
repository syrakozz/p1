import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { HomeStackParamList } from '../../screens/home/home.navigator';
import { TabParamList } from '../../screens/main/main.navigator';
import useLockScreenStore from './useLockScreenStore';
import { MainStackParamList } from '../../screens/main.navigator';
import { useActiveProfileStore } from '../../services/stores/profile.store';

const MAX_TIMEOUT = 2 * 60 * 1000;

type LockScreen = {
  isAuthorized: boolean;
  isAuthorizedUntil: number;
  pin?: string;
  setPin: (pin?: string) => void;
  setLock: () => void;
  checkIfRequiresUnlock: ({ name, params }: { name: string; params?: any }) => void;
};

const unprotectedRoutes: (keyof HomeStackParamList | keyof TabParamList | keyof MainStackParamList)[] = [
  'ProfileInterests',
  'ProfileContentCustomizations',
  'BtPairing',
  'HomeOverview',
  'ProfileOverview',
  'Home',
  'Main',
  'Balance',
  'TalkingMode',
  'HelpScreen',
];

const useLockScreen = createWithEqualityFn<LockScreen>((set, get) => {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return {
    isAuthorized: false,
    isAuthorizedUntil: 0,
    pin: '',
    setPin: pin => set({ pin }),
    setLock: () => {
      clearTimeout(timerId);
      set({ isAuthorized: false, isAuthorizedUntil: 0 });
    },
    checkIfRequiresUnlock: ({ name: routeName, params }) => {
      const { isAuthorized, isAuthorizedUntil, pin } = get();

      if (!pin) {
        return;
      }

      const { activeProfile } = useActiveProfileStore.getState();

      const isProtected =
        !(unprotectedRoutes as string[]).includes(routeName) || (params?.profileId && params.profileId !== activeProfile?.id);

      if (!isProtected) {
        set({ isAuthorized: false });
      } else if (!isAuthorized) {
        if (Date.now() < isAuthorizedUntil) {
          set({ isAuthorized: true });
        } else {
          useLockScreenStore.getState().confirm({
            callback: keepMeAuthorized => {
              set({ isAuthorized: true, isAuthorizedUntil: keepMeAuthorized ? Date.now() + MAX_TIMEOUT : 0 });

              clearTimeout(timerId);
              timerId = setTimeout(() => {
                set({ isAuthorizedUntil: 0 });
              }, MAX_TIMEOUT);
            },
          });
        }
      }
    },
  };
}, shallow);

export default useLockScreen;
