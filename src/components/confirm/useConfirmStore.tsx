import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { ConfirmDialogProps } from './confirm-dialog';

type ConfirmStore = {
  isOpen?: boolean;
  props?: ConfirmDialogProps;
  confirm: (options: Partial<Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel' | 'isOpen'>>) => Promise<boolean>;
};

const useConfirmStore = createWithEqualityFn<ConfirmStore>(
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

export default useConfirmStore;
