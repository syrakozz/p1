import React from 'react';
import { YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input, Button } from '$components';
import { AppHeader, MainContainer } from '$layout';
import { useMutateAccount, useQueryAccount } from '../../hooks/account';
import { AccountStackParamList } from './account.navigator';

type NavProps = NativeStackScreenProps<AccountStackParamList, 'AccountDetails'>;

export default function ParentDetailsScreen(): JSX.Element {
  const nav = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation();
  const { data } = useQueryAccount();
  const { mutateAsync, isLoading } = useMutateAccount();

  const schema = z.object({
    email: z.string().optional(),
    name: z.string().nonempty(t('account.name-required')),
  });

  type Values = z.infer<typeof schema>;

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.display_name || '',
      email: data?.email || '',
    },
  });

  async function onSubmit({ name }: Values) {
    await mutateAsync({ display_name: name });
    nav.navigate('AccountOverview', {});
  }

  return (
    <MainContainer header={<AppHeader title={t('account.account')} canGoBack  showBalance={true} />}>
      <YStack mt="$3.5" space="$3.5">
        <Input size="$5" control={control} name="email" placeholder={t('common.email')} disabled />
        <Input size="$5" control={control} name="name" errorMessage={errors.name?.message} placeholder={t('account.name')} />

        <Button mt="$2.5" theme="primary" fontWeight="600" size="$7" loading={isLoading} onPress={handleSubmit(onSubmit)}>
          {t('common.continue')}
        </Button>
      </YStack>
    </MainContainer>
  );
}
