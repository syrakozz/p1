import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyAccount, sendPinEmail, updateMyAccount } from '../api/vox.api';
import { useUserStore } from '../services/stores/user.store';
import { queryClient } from '../../config';
import { AccountReqPayload } from '../api/vox.types';

export function useQueryAccount() {
  const isCompleted = useUserStore(state => state.status === 'completed');

  return useQuery(['account'], getMyAccount, { enabled: isCompleted });
}

export function useMutateAccount() {
  return useMutation(['updateAccount'], (data: AccountReqPayload) => updateMyAccount(data), {
    onSuccess: data => {
      queryClient.setQueryData(['account'], data);
    },
  });
}

export function useMutateAccountPinEmail() {
  return useMutation(['resetPin'], () => sendPinEmail());
}
