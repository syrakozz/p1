import React, { useEffect, useState } from 'react';
import { AlertDialog, YStack, XStack, Input, Checkbox, CheckedState, Label } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import Button from '../button/button';
import ErrorMessage from '../forms/errorMessage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../screens/main.navigator';
import { Alert } from 'react-native';
import { useMutateAccount, useMutateAccountPinEmail, useQueryAccount } from '../../hooks/account';

export type LockDialogProps = {
  isOpen?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  callback?: ((keepMeAuthorized: CheckedState) => Promise<void> | void) | void;
};

type NavProps = NativeStackScreenProps<MainStackParamList, 'Main'>;

export default function LockDialog({ isOpen, callback, onConfirm, onCancel }: LockDialogProps) {
  const { t } = useTranslation();
  const account = useQueryAccount();
  const { mutateAsync: mutateAccountAsync } = useMutateAccount();
  const { mutateAsync: mutateAccountPinEmailASync } = useMutateAccountPinEmail();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [keepMeAuthorized, setKeepMeAuthorized] = useState<CheckedState>(false);
  const nav = useNavigation<NavProps['navigation']>();
  const checkboxId = 'keep-me-authorized';

  useEffect(() => {
    setError('');
    setValue('');
  }, [isOpen]);

  function generateRandomPin() {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
  }

  async function unlock() {
    if (value === account.data?.pin) {
      await callback?.(keepMeAuthorized);
      onConfirm?.();
    } else {
      setError(t('account.invalid-pin'));
    }
  }

  function cancel() {
    nav.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
    onCancel?.();
  }

  function onForgot() {
    Alert.alert(t('account.forgot-pin'), t('account.new-pin-will-be-sent', { email: account.data?.email }), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('account.send-pin'),
        onPress: () => {
          mutateAccountAsync({ pin: generateRandomPin() }).then(() => {
            mutateAccountPinEmailASync();
          });

          Alert.alert(t('account.we-sent-pin', { email: account.data?.email }), '', [
            {
              text: t('common.ok'),
            },
          ]);
        },
      },
    ]);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay key="overlay" bg="$color12" />
        <AlertDialog.Content w="90%" bordered elevate key="content">
          <YStack space>
            <AlertDialog.Title textAlign="center" fontSize="$8">
              {t('account.verify-your-identity')}
            </AlertDialog.Title>
            <AlertDialog.Description textAlign="center">{t('account.use-pin-to-verify')}</AlertDialog.Description>
            <Input onChangeText={setValue} placeholder="PIN" keyboardType="numeric" secureTextEntry autoComplete="off" />
            {error && <ErrorMessage mt="$1.5">{error}</ErrorMessage>}

            <XStack space="$3.5">
              <Checkbox id={checkboxId} checked={keepMeAuthorized} onCheckedChange={setKeepMeAuthorized} size="$5">
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </Checkbox>

              <Label htmlFor={checkboxId} flex={1} flexWrap="wrap" lineHeight="$3">
                {t('account.keep-unlocked')}
              </Label>
            </XStack>

            <YStack space="$3">
              <XStack space="$3" justifyContent="flex-end">
                <Button chromeless theme="inverse" fontWeight="600" onPress={cancel}>
                  {t('common.cancel')}
                </Button>
                <Button theme="primary" flex={1} fontWeight="600" onPress={unlock}>
                  {t('account.unlock')}
                </Button>
              </XStack>
              <XStack justifyContent="center">
                <Button chromeless theme="inverse" flex={1} fontWeight="600" onPress={onForgot}>
                  {t('account.forgot-pin')}
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
