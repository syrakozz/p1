import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Text, View, XStack, YStack } from 'tamagui';
import { useForm, useWatch } from 'react-hook-form';
import { MainContainer, AppHeader } from '$layout';
import { Checkbox, Input } from '$components';
import { useMutateProfile, useQueryProfile } from '$hooks';
import { DEFAULT_INTERESTS, Interest } from '../../api/vox.types';
import { HomeStackParamList } from './home.navigator';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProfileInterests'>;

export default function ProfileInterestsScreen({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const profileId = route.params.profileId;
  const profile = useQueryProfile(profileId);
  const { mutateAsync } = useMutateProfile(profileId);

  type Values = { interests: { id: Interest; selected: boolean }[] };

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<Values>({
    defaultValues: {
      interests: DEFAULT_INTERESTS?.map(interest => ({ id: interest, selected: profile.data?.interests?.includes(interest) })) || [],
    },
  });

  const onSubmit = async ({ interests }: Values) => {
    await mutateAsync({
      interests: interests?.filter(({ id, selected }) => id && selected).map(({ id }) => id),
    });

    reset({ interests }, { keepValues: true });
  };

  const fields = useWatch({ control });

  useEffect(() => {
    if (isDirty) {
      setTimeout(() => {
        handleSubmit(onSubmit)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, isDirty, handleSubmit]);

  return (
    <MainContainer isFetching={profile.isFetching} header={<AppHeader title={t('profile.interests')} canGoBack />}
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.interests'}/>,
    }}
    >
      <YStack mt="$2" space="$6">
        <YStack>
          <Text fontSize="$4" fontWeight="600" mb="$3">
            {t('profile.interests')} ({t('profile.select-all')})
          </Text>
          <XStack flexWrap="wrap">
            {DEFAULT_INTERESTS.map((interest, index) => {
              return (
                <View width="50%" padding="$2" key={interest}>
                  <Input display="none" control={control} name={`interests[${index}].id`} defaultValue={interest} />
                  <Checkbox control={control} name={`interests[${index}].selected`}>
                    {t(`common.${interest}`)}
                  </Checkbox>
                </View>
              );
            })}
          </XStack>
        </YStack>
      </YStack>
    </MainContainer>
  );
}
