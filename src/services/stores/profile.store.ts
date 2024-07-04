import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { AccountPreferences, Profile } from '../../api/vox.types';

export interface ActiveProfileState {
  activeProfile: Profile | null;
  setActiveProfile: (profiles: Profile[], preferences: AccountPreferences) => void;
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;
  reset: () => void;
}

const initialState = {
  isFetching: false,
  activeProfile: null,
};

export const useActiveProfileStore = createWithEqualityFn<ActiveProfileState>(
  set => ({
    ...initialState,
    setActiveProfile(profiles: Profile[], preferences: AccountPreferences) {
      const activeProfileIndex = (profiles ?? []).findIndex(profile => profile.id === preferences?.['2xl:activeProfileId']);
      const activeProfile = profiles?.[activeProfileIndex];

      set({ activeProfile });
    },
    setIsFetching(isFetching: boolean) {
      set({ isFetching });
    },
    reset() {
      set(initialState);
    },
  }),
  shallow
);
