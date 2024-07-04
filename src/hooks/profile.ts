import { useMutation, useQuery } from '@tanstack/react-query';
import { createProfile, deleteProfile, getProfile, getProfiles, updateProfile } from '../api/vox.api';
import { Profile } from '../api/vox.types';
import { queryClient } from '../../config';

export const profilesQueryKey = ['profiles'];
export const profileQueryKey = 'profile';
export const profileUpdateMutationKey = ['updateProfile'];

export function upsert<T extends { id: string }>(array: T[], element: T) {
  const indexToUpdate = array.findIndex(item => item.id === element.id);

  if (indexToUpdate === -1) {
    return [...array, element];
  } else {
    return [...array.slice(0, indexToUpdate), element, ...array.slice(indexToUpdate + 1)];
  }
}

export function useQueryProfile(profileId?: string) {
  return useQuery([profileQueryKey, profileId], () => getProfile(profileId as string), { enabled: !!profileId });
}

export function useMutateProfile(
  profileId: string,
  {
    onSuccess,
  }: {
    onSuccess?: (data: Profile) => void | Promise<void>;
  } = {}
) {
  const profile = useQueryProfile(profileId);

  return useMutation(profileUpdateMutationKey, (data: Partial<Profile>) => updateProfile(profileId, data), {
    onSuccess,
    onMutate: async data => {
      queryClient.setQueryData<Profile[]>(profilesQueryKey, profiles =>
        upsert<Profile>(profiles || [], { ...profile.data, ...data } as Profile)
      );
      queryClient.setQueryData([profileQueryKey, profileId], { ...profile.data, ...data });
    },
  });
}

export function useCreateProfile({
  onSuccess,
}: {
  onSuccess?: (data: Profile) => void | Promise<void>;
} = {}) {
  return useMutation(['createProfile'], (data: Partial<Profile>) => createProfile(data), {
    onSuccess: async data => {
      onSuccess?.(data);
      queryClient.setQueryData([profileQueryKey, data.id], data);
      queryClient.setQueryData<Profile[]>(profilesQueryKey, profiles => upsert<Profile>(profiles || [], data));
    },
  });
}

export function useDeleteProfile({
  onSuccess,
}: {
  onSuccess?: (id: string) => void | Promise<void>;
} = {}) {
  return useMutation(['deleteProfile'], (id: string) => deleteProfile(id), {
    onSuccess: (id: string) => {
      onSuccess?.(id);
      queryClient.setQueryData([profileQueryKey, id], undefined);
      queryClient.setQueryData<Profile[]>(profilesQueryKey, profiles => (profiles || []).filter(p => p.id !== id));
    },
  });
}

export function useQueryProfiles() {
  return useQuery(profilesQueryKey, getProfiles);
}
