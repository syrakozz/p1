import { Alert } from 'react-native';
import { t } from 'i18next';
import firebase from '@react-native-firebase/app';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import reactotron from 'reactotron-react-native';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { queryClient } from '../../../config';
import { AppLanguage, Notification } from '../../api/vox.types';
import i18n from '../../i18n/i18n.config';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getFirebaseConfig } from '../../config/firebase.config';
import { country, isProd } from '../http.service';

export type AuthStatus = 'idle' | 'unverified' | 'registering' | 'signing-in' | 'verified' | 'completed';

export interface UserState {
  user: FirebaseAuthTypes.User | null;
  auth: Promise<FirebaseAuthTypes.Module>;
  subscribe: () => () => void;
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
  language: AppLanguage | null;
  setLanguage: (language: AppLanguage) => void;
  reset: () => void;
  notifications: Notification[];
  balance: number | undefined;
}

const firebaseAppPromise = firebase.apps.some(app => app.name === 'CustomConfig')
  ? Promise.resolve(firebase.app('CustomConfig'))
  : firebase.initializeApp(getFirebaseConfig(isProd ? country : 'UAT'), 'CustomConfig');

const initialState = {
  user: null,
  auth: firebaseAppPromise.then(firebaseApp => auth(firebaseApp)),
  language: null,
  status: 'idle' as const,
  notifications: [],
  balance: -1,
};

function checkBalanceLimit(limit: number, current: number, previous: number | undefined) {
  if (current && previous && current < limit && previous >= limit) {
    return true;
  }
  return false;
}

export function displayVexelsAlert() {
  Alert.alert(`🚨 ${t('balance.alert.title')} 🚨`, t('balance.alert.description'), [
    // {
    //   text: t('common.cancel'),
    //   style: 'cancel',
    // },
    {
      text: t('balance.alert.cta'),
      onPress: () => {
        // TODO: navigate to balance screen
        console.log('OK Pressed');
      },
    },
  ]);
}

export const useUserStore = createWithEqualityFn<UserState>(
  (set, get) => ({
    ...initialState,
    subscribe: () => {
      let notificationsSub: (() => void) | undefined;
      let balanceSub: (() => void) | undefined;
      let timer: ReturnType<typeof setTimeout>;
      let authSub: () => void | undefined;
      firebaseAppPromise.then(firebaseApp => {
        auth(firebaseApp).settings.appVerificationDisabledForTesting = __DEV__;
        authSub = auth(firebaseApp).onAuthStateChanged(user => {
          if (user && user.emailVerified) {
            reactotron?.log?.(user.emailVerified);
            timer = setTimeout(() => {
              try {
                balanceSub;
                balanceSub = firestore(firebaseApp)
                  .collection('accounts')
                  .doc(user.uid)
                  .collection('bank')
                  .doc('balance')
                  .onSnapshot(balanceSnapshot => {
                    const { balance: previousBalance } = get();
                    const balance = balanceSnapshot?.data()?.balance;
                    if (previousBalance !== balance) {
                      set({ balance });
                      if ([3_000, 2_000, 1_000].some(limit => checkBalanceLimit(limit, balance, previousBalance))) {
                        displayVexelsAlert();
                      }
                    }
                  });
              } catch {
                Alert.alert('Error', 'Error fetching balance');
              }

              try {
                notificationsSub?.();
                notificationsSub = firestore(firebaseApp)
                  .collection('accounts')
                  .doc(user.uid)
                  .collection('notifications')
                  .onSnapshot(notificationSnapshots => {
                    if (notificationSnapshots) {
                      const notifications: Notification[] = [];

                      notificationSnapshots.forEach(notification => {
                        notifications.push(notification.data() as Notification);
                      });

                      set({ notifications });
                    }
                  });
              } catch {
                Alert.alert('Error', 'Error fetching notifications');
              }
            }, 5000);
          } else {
            queryClient.clear();
            notificationsSub?.();
            clearTimeout(timer);
          }

          /** user auth is completed when:
           * already logged in (being idle when the user is set)
           * register login/register has finished, including the preferences mutation
           **/
          set(prevState => ({ user, status: user ? (prevState.status === 'idle' ? 'completed' : 'verified') : 'unverified' }));
        });
      });

      return () => {
        authSub?.();
        notificationsSub?.();
        clearTimeout(timer);
      };
    },
    setStatus: (status: AuthStatus) => {
      set({ status });
    },
    setLanguage: (language: AppLanguage) => {
      i18n.changeLanguage(language);
      set({ language });
    },
    reset: () => {
      set(initialState);
    },
  }),
  shallow
);
