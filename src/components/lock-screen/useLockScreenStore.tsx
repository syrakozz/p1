import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { LockDialogProps } from './lock-dialog';

type LockScreenStore = {
  isOpen?: boolean;
  props?: LockDialogProps;
  confirm: (options: Partial<LockDialogProps>) => Promise<boolean>;
};

const useLockScreenStore = createWithEqualityFn<LockScreenStore>(
  set => ({
    isOpen: false,
    confirm: props => {
      set({ isOpen: true });

      return new Promise(resolve => {
        set({
          props: {
            ...props,
            async onConfirm() {
              resolve(true);
              set({ isOpen: false });
            },
            onCancel() {
              resolve(false);
              set({ isOpen: false });
            },
          },
        });
      });
    },
  }),
  shallow
);

export default useLockScreenStore;
