import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid';
import { Circle, Square, Text, YStack } from 'tamagui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AppHeader, MainContainer } from '$layout';
import { Input, Button } from '$components';
import { useCreateProfile, useMutatePreferences, useMutateProfile, useQueryPreferences, useQueryProfile } from '$hooks';
import { HomeStackParamList } from './home.navigator';
import { AppLanguage, CharacterLanguage } from '../../api/vox.types';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProfilePersonalDetails'>;

const appLanguageToCharacterLanguage: Record<AppLanguage, CharacterLanguage> = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de',
  it: 'it',
  bg: 'bg',
  cz: 'cz',
  nl: 'nl',
  pt: 'pt-PT',
  pl: 'pl',
  da: 'da',
  sv: 'sv',
  fi: 'fi',
  el: 'el',
  ro: 'ro',
  ru: 'ru',
} as const;

export default function ProfilePersonalDetails({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const profileId = route.params.profileId;
  const { mutateAsync: mutatePreferenceAsync } = useMutatePreferences();
  const profile = useQueryProfile(profileId);
  const preferences = useQueryPreferences();
  const createProfile = useCreateProfile({
    async onSuccess(response) {
      mutatePreferenceAsync({ '2xl:activeProfileId': response.id });

      nav.replace('ProfileOverview', { profileId: response.id });
      if (profileId) {
        nav.pop();
      }
    },
  });
  const updateProfile = useMutateProfile(profileId as string, {
    async onSuccess(response) {
      nav.replace('ProfileOverview', { profileId: response.id });
      if (profileId) {
        nav.pop();
      }
    },
  });

  const validationSchema = z.object({
    name: z.string().nonempty(t('profile.name-required')),
    response_age: z.coerce
      .number()
      .positive(t('profile.age-required'))
      .max(150, t('profile.age-too-big'))
      .transform(val => `${Math.round(val)}`),
  });

  type Values = z.infer<typeof validationSchema>;

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<Values>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: profile.data?.name,
      response_age: profile.data?.response_age ? `${profile.data?.response_age}` : '',
    },
  });

  const onSubmit = async (values: Values) => {
    if (profileId) {
      await updateProfile.mutateAsync({
        id: profileId,
        name: values.name?.trim(),
        response_age: +values.response_age,
      });
    } else {
      await createProfile.mutateAsync({
        id: uuid.v4() as string,
        name: values.name,
        response_age: +values.response_age,
        selected_character: '2-xl',
        inactive: false,
        moderate: true,
        interests: [],
        topics_discourage: [],
        topics_encourage: [],
        characters: {
          '2-xl': {
            language: appLanguageToCharacterLanguage[preferences.data?.['2xl:language'] as AppLanguage],
            mode: 'conversation' as const,
            voice: 'default' as const,
            image_style: 'comic-book' as const,
          },
        },
        notifications: {
          moderations: {
            harassment: true,
            harassment_threatening: true,
            hate: true,
            hate_threatening: true,
            selfharm: true,
            selfharm_instructions: true,
            selfharm_intent: true,
            sexual: true,
            sexual_minors: true,
            violence: true,
            violence_graphic: true,
          },
          text_analysis: {
            toxic: false,
            pegi_rating: true,
          },
        },
      });
    }
  };

  return (
    <MainContainer 
    header={<AppHeader title={t('profile.personal-details')} canGoBack />
    }
    fab={{
      icon: <HelpDialog
      isAuto={true}
       helpId={'help.yourprofile'}/>,
    }}
    >
      <YStack mt="$3.5">
        <Text fontSize="$4" fontWeight="600" mb="$3">
          {t('profile.add-profile-info')}
        </Text>
        <YStack space="$3.5">
          <Input size="$5" control={control} name="name" errorMessage={errors.name?.message} placeholder={t('common.name')} />
          <Input
            size="$5"
            control={control}
            name="response_age"
            errorMessage={errors.response_age?.message}
            placeholder={t('common.age')}
            keyboardType="numeric"
          />
        </YStack>
       

        <Button theme="primary" fontWeight="600" size="$7" mt="$6" loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          {profileId ? t('common.save') : t('common.create')}
        </Button>
       
      </YStack>
    </MainContainer>
  );
}
