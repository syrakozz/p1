import React, { useEffect, useMemo } from 'react';
import Config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Text, YStack } from 'tamagui';
import { useForm, useWatch } from 'react-hook-form';
import { MainContainer, AppHeader } from '$layout';
import { Select, ToggleGroup } from '$components';
import { useMutateProfile, useMutateProfileCharacters, useQueryCharacters, useQueryImageStyles, useQueryProfile } from '$hooks';
import { HomeStackParamList } from './home.navigator';
import { CharacterVoice, CharacterLanguage, CharacterMode, CharacterImageStyle } from '../../api/vox.types';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProfileContentCustomizations'>;

export default function ProfileContentCustomizationsScreen({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const profileId = route.params.profileId;
  const profile = useQueryProfile(profileId);
  const characters = useQueryCharacters();
  const imageStyles = useQueryImageStyles();
  const selectedCharacter = profile.data?.characters?.[profile.data.selected_character];
  const isFetching = profile.isFetching || characters.isFetching || imageStyles.isFetching;
  const { mutateAsync: mutateProfileCharacters } = useMutateProfileCharacters(profileId);
  const { mutateAsync: mutateProfile } = useMutateProfile(profileId);

  type Values = {
    selected_character: string;
    mode: CharacterMode | null;
    language: CharacterLanguage | 'auto' | null;
    voice: CharacterVoice | null;
    image_style: CharacterImageStyle | null;
  };

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
    control,
  } = useForm<Values>({
    defaultValues: {
      selected_character: profile.data?.selected_character,
      voice: selectedCharacter?.voice || 'default',
      language: (selectedCharacter?.language ?? 'en-US') || 'auto',
      mode: selectedCharacter?.mode || 'conversation',
      image_style: selectedCharacter?.image_style || 'comic-book',
    },
  });

  // react to mode change from the toy buttons
  useEffect(() => {
    setValue('mode', selectedCharacter?.mode as CharacterMode);
  }, [setValue, selectedCharacter]);

  const fields = useWatch({ control, name: ['language', 'mode', 'voice'] });
  const characterNameField = useWatch({ control, name: 'selected_character' });
  const character = useMemo(() => characters.data?.find(option => option.key === characterNameField), [characterNameField, characters]);

  const onSubmit = async ({ language, ...rest }: Values) => {
    const values = { language: language === 'auto' ? '' : language, ...rest };

    await mutateProfileCharacters(values);
    reset(values, { keepValues: true });
  };

  const onCharacterChange = async (value: string) => {
    const newSelectedCharacter = profile.data?.characters?.[value];
    const values = {
      selected_character: value,
      voice: newSelectedCharacter?.voice ?? 'default',
      language: (newSelectedCharacter?.language ?? 'en-US') || 'auto',
      mode: newSelectedCharacter?.mode ?? 'conversation',
      image_style: newSelectedCharacter?.image_style ?? 'comic-book',
    } as const;

    reset(values);
    await mutateProfile({ selected_character: value });
    onSubmit(values);
  };

  useEffect(() => {
    if (isDirty) {
      setTimeout(() => {
        handleSubmit(onSubmit)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, isDirty, handleSubmit]);

  return (
    <MainContainer isFetching={isFetching} header={<AppHeader title={t('profile.customizations')} canGoBack />}
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.customizations'}/>,
    }}
    >
      <YStack space="$6">
        {characters.data && characters.data.length > 1 && Config.PUBLIC_WHITELABEL === 'magic' && (
          <YStack>
            <Text fontSize="$4" fontWeight="600" mb="$3">
              {t('profile.character')}
            </Text>

            <Select
              name="selected_character"
              control={control}
              size="$4"
              selectLabel={t('profile.select-character')}
              items={characters.data.map(({ key, name }) => ({ value: key, label: name }))}
              onValueChange={onCharacterChange}
            />
          </YStack>
        )}

        {character && (
          <YStack space="$6">
            {character.voices && character.voices.length > 1 && (
              <YStack>
                <Text fontSize="$4" fontWeight="600" mb="$3">
                  {t('profile.2xl-voice')}
                </Text>
                <ToggleGroup
                  name="voice"
                  control={control}
                  items={character.voices.map(voice => ({
                    value: voice,
                    label: t(`profile.${voice as CharacterVoice}`),
                  }))}
                  type="single"
                  size="$4"
                  disableDeactivation
                />
              </YStack>
            )}

            {character.languages && character.languages.length > 1 && (
              <YStack key={`${character.key}-language`}>
                <Text fontSize="$4" fontWeight="600" mb="$3">
                  {t('profile.2xl-language')}
                </Text>
                <Select
                  name="language"
                  control={control}
                  size="$4"
                  selectLabel={t('profile.select-language')}
                  items={character.languages
                    .map(language => ({
                      value: language || 'auto',
                      label: (language !== '' ? t(`language.${language}`) : t('common.not-listed')) as string,
                    }))
                    // show Auto always last, otherwise sort ascending based on label
                    .sort((l1, l2) => {
                      if (l1.value === 'auto') {
                        return 1;
                      }
                      if (l2.value === 'auto') {
                        return -1;
                      }
                      return l1.label.localeCompare(l2.label);
                    })}
                />
              </YStack>
            )}

            {imageStyles.data && Config.PUBLIC_WHITELABEL === 'magic' && (
              <YStack key={`${character.key}-imageStyle`}>
                <Text fontSize="$4" fontWeight="600" mb="$3">
                  {t('profile.image-style')}
                </Text>
                <Select
                  name="image_style"
                  control={control}
                  size="$4"
                  selectLabel={t('profile.select-image-style')}
                  items={imageStyles.data
                    .map(imageStyle => ({
                      value: imageStyle,
                      label: t(`common.${imageStyle as CharacterImageStyle}`) as string,
                    }))
                    .sort((l1, l2) => l1.label.localeCompare(l2.label))}
                />
              </YStack>
            )}

            {character.modes && character.modes.length > 1 && (
              <YStack>
                <Text fontSize="$4" fontWeight="600" mb="$3">
                  {t('profile.2xl-mode')}
                </Text>
                <ToggleGroup
                  name="mode"
                  control={control}
                  type="single"
                  size="$4"
                  disableDeactivation
                  orientation="vertical"
                  items={character.modes.map(mode => ({
                    value: mode,
                    label: t(`profile.${mode as CharacterMode}`),
                    description: t(`profile.${mode as CharacterMode}-description`),
                  }))}
                />
              </YStack>
            )}
          </YStack>
        )}
      </YStack>
    </MainContainer>
  );
}
