import dayjs from 'dayjs';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { Profile } from '../../api/vox.types';

export interface HistoryState {
  reviewProfile: Profile | null;
  setReviewProfile: (profile: Profile) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  reset: () => void;
}

const initialState = {
  reviewProfile: null,
  selectedDate: dayjs().format('YYYY-MM-DD'),
};

export const useHistoryStore = createWithEqualityFn<HistoryState>(
  set => ({
    ...initialState,
    setReviewProfile: (reviewProfile: Profile) => {
      set({ reviewProfile });
    },
    setSelectedDate: (selectedDate: string) => {
      set({ selectedDate });
    },
    reset: () => set(initialState),
  }),
  shallow
);
