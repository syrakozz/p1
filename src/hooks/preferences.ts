import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyPreferences, updateMyPreferences } from '../api/vox.api';
import { queryClient } from '../../config';
import { AccountPreferences } from '../api/vox.types';
import i18n from '../i18n/i18n.config';
import { useUserStore } from '../services/stores/user.store';

export const preferencesQueryKey = ['preferences'];
export const preferencesUpdateKey = ['updatePreferences'];

export function useMutatePreferences() {
  return useMutation(preferencesUpdateKey, updateMyPreferences, {
    onMutate: async newPreferences => {
      await queryClient.cancelQueries({ queryKey: preferencesQueryKey });
      const previousPreferences = queryClient.getQueryData<AccountPreferences>(preferencesQueryKey);
      const data = { ...previousPreferences, ...newPreferences };
      queryClient.setQueryData<AccountPreferences>(preferencesQueryKey, data);
      i18n.changeLanguage(data['2xl:language'] || 'en');

      return { previousPreferences };
    },

    onError: (err, _, context) => {
      if (err) {
        queryClient.setQueryData(preferencesQueryKey, context?.previousPreferences);
      }
    },
  });
}

export function useQueryPreferences() {
  const isCompleted = useUserStore(state => state.status === 'completed');

  return useQuery(preferencesQueryKey, getMyPreferences, {
    enabled: isCompleted,
    onSuccess: data => {
      i18n.changeLanguage(data['2xl:language'] || 'en');
    },
  });
}
