import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { YStack } from 'tamagui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Input, Button } from '$components';
import { useUserStore } from '../../services/stores/user.store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../main.navigator';
import { AuthErrorMessage, AuthErrorPath, getMessageForAuthErrorCode, getPathForAuthErrorCode } from '../../services/utils/auth.utils';
import { Header, MainContainer } from '$layout';
import Config from 'react-native-config';
import { useLayoutData, useMutatePreferences } from '$hooks';
import { AppLanguage } from '../../api/vox.types';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<MainStackParamList, 'Password'>;

const EMPTY_ERRORS: { [key in AuthErrorPath]?: AuthErrorMessage | '' } = {
  password: '',
  generic: '',
};

export default function PasswordScreen({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const [authErrors, setAuthErrors] = useState(EMPTY_ERRORS);
  const { status, language, setStatus } = useUserStore();
  const { mutateAsync } = useMutatePreferences();
  const { isFetching } = useLayoutData();
  const { auth } = useUserStore();
  const nav = useNavigation<Props['navigation']>();

  const validationSchema = z.object({
    password: z.string().nonempty(t('password.please-provide-password')).min(6, t('password.minimum-characters')),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleAuthError = (err: FirebaseAuthTypes.NativeFirebaseAuthError) => {
    setAuthErrors({
      ...EMPTY_ERRORS,
      [getPathForAuthErrorCode(err.code)]: getMessageForAuthErrorCode(err.code),
    });
  };

  const checkEmailVerified = (authModule: FirebaseAuthTypes.Module, credential: FirebaseAuthTypes.UserCredential) => {
    if (!credential.user.emailVerified) {
      Alert.alert('Please verify your email address');
      authModule.signOut();
      nav.navigate('Login', {});
      return false;
    }
    return true;
  };

  const onSubmit = async (data: ValidationSchema) => {
    const [email, password] = [route.params.email, data.password];
    setAuthErrors(EMPTY_ERRORS);

    try {
      const _auth = await auth;
      let userCredential;
      if (status === 'registering') {
        userCredential = await _auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.sendEmailVerification();
        await mutateAsync({
          '2xl:isFirstLogin': true,
          '2xl:language': language as AppLanguage,
          '2xl:talkingMode': Config.PUBLIC_WHITELABEL === '2xl' ? 'auto' : 'press',
          '2xl:hasInsightFiller': true,
          '2xl:hasThinkingFiller': true,
        });
      } else if (status === 'signing-in') {
        userCredential = await _auth.signInWithEmailAndPassword(email, password);
      }
      if (userCredential && checkEmailVerified(_auth, userCredential)) {
        setStatus('completed');
      }
    } catch (err) {
      handleAuthError(err as FirebaseAuthTypes.NativeFirebaseAuthError);
    }
  };

  return (
    <MainContainer header={<Header title={t('password.enter-password')} logo canGoBack />}>
      <YStack mt="$6">
        <Input
          autoCapitalize="none"
          control={control}
          name="password"
          errorMessage={
            errors.password?.message || (authErrors.password && t(authErrors.password)) || (authErrors.generic && t(authErrors.generic))
          }
          placeholder={t(status === 'registering' ? 'password.please-provide-password' : 'password.please-enter-password')}
          size="$7"
          secureTextEntry
        />

        <Button theme="primary" fontWeight="600" size="$7" mt="$6" loading={isSubmitting || isFetching} onPress={handleSubmit(onSubmit)}>
          {t('common.continue')}
        </Button>
      </YStack>
    </MainContainer>
  );
}
