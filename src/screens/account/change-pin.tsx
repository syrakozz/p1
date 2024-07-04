import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, MainContainer } from '$layout';
import { YStack } from 'tamagui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input } from '$components';
import { useMutateAccount } from '../../hooks/account';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccountStackParamList } from './account.navigator';

type Props = NativeStackScreenProps<AccountStackParamList, 'ChangePin'>;

export default function ChangePinScreen(): JSX.Element {
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = useMutateAccount();
  const nav = useNavigation<Props['navigation']>();

  const schema = z
    .object({
      pin: z.string().min(4, t('account.pin-length')),
      confirmPin: z.string().optional(),
    })
    .superRefine(({ pin, confirmPin }, ctx) => {
      if (pin !== confirmPin) {
        ctx.addIssue({
          code: 'custom',
          message: 'The pins did not match',
          path: ['confirmPin'],
        });
      }
    });

  type Values = z.infer<typeof schema>;

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  async function onSubmit({ pin }: Values) {
    await mutateAsync({ pin });
    nav.navigate('AccountOverview', {});
  }

  return (
    <MainContainer header={<AppHeader title={t('account.new-pin')} canGoBack  showBalance={true}  />}>
      <YStack space="$3.5">
        <Input
          size="$5"
          control={control}
          name="pin"
          errorMessage={errors.pin?.message}
          placeholder={t('account.pin')}
          keyboardType="numeric"
          secureTextEntry
        />
        <Input
          size="$5"
          control={control}
          name="confirmPin"
          errorMessage={errors.confirmPin?.message}
          placeholder={t('account.confirm-pin')}
          keyboardType="numeric"
          secureTextEntry
        />

        <Button mt="$2.5" theme="primary" fontWeight="600" size="$7" loading={isLoading} onPress={handleSubmit(onSubmit)}>
          {t('common.save')}
        </Button>
      </YStack>
    </MainContainer>
  );
}
