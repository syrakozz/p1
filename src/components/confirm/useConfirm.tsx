import useConfirmStore from './useConfirmStore';

export default function useConfirm() {
  return useConfirmStore(state => state.confirm);
}
