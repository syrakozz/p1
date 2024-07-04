import { useMutation, useQuery } from '@tanstack/react-query';
import { getCharacters, getCharacterImageStyles, updateProfileCharacter } from '../api/vox.api';
import { queryClient } from '../../config';
import { CharacterMode, CharacterVoice, CharacterLanguage, Profile } from '../api/vox.types';
import { profilesQueryKey, upsert, useQueryProfile } from './profile';

export const charactersQueryKey = ['characters'];
export const imageStylesQueryKey = ['characters-image-styles'];

export function useQueryCharacters() {
  return useQuery(charactersQueryKey, getCharacters);
}

export function useMutateProfileCharacters(profileId: string) {
  const profile = useQueryProfile(profileId);

  return useMutation(
    ['updateProfileCharacter'],
    ({
      selected_character,
      ...data
    }: {
      selected_character: string;
      voice?: CharacterVoice | null;
      language?: CharacterLanguage | null;
      mode?: CharacterMode | null;
    }) => updateProfileCharacter(profileId, selected_character, data),
    {
      onMutate: async ({ selected_character, ...data }) => {
        const newProfile = {
          ...profile.data,
          characters: { ...profile.data?.characters, [selected_character]: { ...profile.data?.characters?.[selected_character], ...data } },
        } as Profile;

        queryClient.setQueryData<Profile[]>(profilesQueryKey, profiles => upsert(profiles ?? [], newProfile));
        queryClient.setQueryData(['profile', profile.data?.id], newProfile);
      },
    }
  );
}

export function useQueryImageStyles() {
  return useQuery(imageStylesQueryKey, getCharacterImageStyles);
}
