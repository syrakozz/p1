import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

export type ConnectionStoreState = NetInfoState & {
  reset: () => void;
};

const initialState: NetInfoState = {
  isConnected: false,
  details: null,
  isInternetReachable: false,
  type: NetInfoStateType.none,
};

export const useConnectionStore = createWithEqualityFn<ConnectionStoreState>(set => {
  const unsubscribe = NetInfo.addEventListener(set);

  function reset() {
    unsubscribe();
  }

  return {
    ...initialState,
    reset,
  };
}, shallow);
