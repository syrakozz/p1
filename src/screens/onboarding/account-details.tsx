import React from 'react';
import { Text, YStack } from 'tamagui';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input, Button, Checkbox } from '$components';
import { MainStackParamList } from '../main.navigator';
import { MainContainer, OnboardingHeader } from '$layout';
import { useMutateAccount, useQueryAccount } from '../../hooks/account';
import { Alert, Linking } from 'react-native';
import { useMutatePreferences } from '$hooks';

type NavProps = NativeStackScreenProps<MainStackParamList, 'AccountDetails'>;

export default function ParentDetailsScreen(): JSX.Element {
  const nav = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation();
  const { data } = useQueryAccount();
  const { mutateAsync, isLoading } = useMutateAccount();
  const { mutate } = useMutatePreferences();

  const schema = z
    .object({
      name: z.string().nonempty(t('account.name-required')),
      pinEnabled: z.boolean(),
      pin: z.string().optional(),
      confirmPin: z.string().optional(),
      termsAndConditions: z.boolean(),
    })
    .superRefine(({ pinEnabled, pin, confirmPin }, ctx) => {
      if (pinEnabled) {
        if (!pin || pin.length < 4) {
          ctx.addIssue({
            code: 'custom',
            message: t('account.pin-length'),
            path: ['pin'],
          });
        }

        if (pin !== confirmPin) {
          ctx.addIssue({
            code: 'custom',
            message: 'The pins did not match',
            path: ['confirmPin'],
          });
        }
      }
    });

  type Values = z.infer<typeof schema>;

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      pinEnabled: false,
      name: data?.display_name || '',
      termsAndConditions: false,
    },
  });

  async function onSubmit({ name, pin }: Values) {
    await mutateAsync({ display_name: name, pin });
    mutate({ '2xl:isFirstLogin': false });
    nav.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  }

  const watchTermsAndConditions = watch('termsAndConditions');
  const watchPinEnabled = watch('pinEnabled');

  return (
    <MainContainer header={<OnboardingHeader title={t('account.account')} leftAction={null} logo />}
   
    >
      <YStack mt="$3.5" space="$3.5">
        <Input size="$5" control={control} name="name" errorMessage={errors.name?.message} placeholder={t('account.name')} />
        <Checkbox control={control} name="pinEnabled">
          {t('account.enable-pin')}
        </Checkbox>
        <Text color="$color11" mt="$-2">
          {t('account.pin-protection-ensures')}
        </Text>

        {watchPinEnabled && (
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
          </YStack>
        )}

        <YStack space="$5" mt="$2.5">
          <Checkbox control={control} name="termsAndConditions">
            <Trans i18nKey="account.agree-to-terms-and-privacy" as={Text}>
              I agree to
              <Text
                theme="primary"
                color="$color9"
                onPress={() => {
                  Linking.openURL('https://www.my2xl.com/privacy-policy/');
                }}>
                Privacy Policy
              </Text>
              <Text
                theme="primary"
                color="$color9"
                onPress={() => {
                  Linking.openURL('https://www.my2xl.com/terms-of-use/');
                }}>
                Terms of Use
              </Text>
              <Text
                theme="primary"
                color="$color9"
                onPress={() => {
                  Linking.openURL('https://www.my2xl.com/product-eula/');
                }}>
                Product End User License Agreement
              </Text>
              <Text
                theme="primary"
                color="$color9"
                onPress={() => {
                  Linking.openURL('https://www.my2xl.com/parent-application-eula/');
                }}>
                Parent Application End User License Agreement
              </Text>
            </Trans>
          </Checkbox>
          <Button
            theme="primary"
            fontWeight="600"
            size="$7"
            disabled={!watchTermsAndConditions}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}>
            {t('common.continue')}
          </Button>
        </YStack>
      </YStack>
    </MainContainer>
  );
}
