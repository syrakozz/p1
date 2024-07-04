import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Input, Button } from '$components';
import { Header, MainContainer } from '$layout';
import { AuthErrorCode } from '../../services/utils/auth.utils';
import { useUserStore } from '../../services/stores/user.store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../main.navigator';
import { YStack } from 'tamagui';

const STRONG_RANDOM_PASS = 'm9C%#n^caqz^)K5Y%wa!y8qSa$UvQfL8';
type Props = NativeStackScreenProps<MainStackParamList, 'Login'>;

export default function LoginScreen(): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const { setStatus } = useUserStore();
  const { auth } = useUserStore();

  useEffect(() => {
    setStatus('idle');
  }, [setStatus]);

  const validationSchema = z.object({
    email: z.string().nonempty(t('login.enter-your-email')).email(t('login.enter-valid-email')),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSignInError = ({ email }: ValidationSchema, err: FirebaseAuthTypes.NativeFirebaseAuthError) => {
    if ((err.code as AuthErrorCode) === 'auth/user-not-found') {
      setStatus('registering');
    } else {
      setStatus('signing-in');
    }

    nav.navigate('Password', { email });
  };

  const handleResetPasswordError = (err: FirebaseAuthTypes.NativeFirebaseAuthError) => {
    Alert.alert((err.code as AuthErrorCode) === 'auth/user-not-found' ? t('login.check-email') : t('auth.auth-error'));
  };

  const onSubmit = async (data: ValidationSchema) => {
    await auth.then(a => a.signInWithEmailAndPassword(data.email, STRONG_RANDOM_PASS).catch(err => handleSignInError(data, err)));
  };

  const onForgot = async (data: ValidationSchema) => {
    auth
      .then(a => a.sendPasswordResetEmail(data.email))
      .then(() => Alert.alert(t('login.check-email')))
      .catch(err => handleResetPasswordError(err));
    return;
  };

  return (
    <MainContainer header={<Header title={t('login.getting-started')} logo canGoBack />}>
      <YStack mt="$6">
        <Input
          inputMode="email"
          autoCapitalize="none"
          control={control}
          name="email"
          errorMessage={errors.email?.message}
          placeholder={t('login.enter-email')}
          size="$7"
        />

        <Button theme="primary" fontWeight="600" size="$7" mt="$6" loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          {t('common.continue')}
        </Button>
        <Button theme="subtle" fontWeight="600" size="$5" mt="$4" onPress={handleSubmit(onForgot)}>
          {t('login.forgot')}
        </Button>
      </YStack>
    </MainContainer>
  );
}
