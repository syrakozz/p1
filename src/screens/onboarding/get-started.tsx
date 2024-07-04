import React from 'react';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { Theme, YStack, SizableText, Image, XStack } from 'tamagui';
import { MainStackParamList } from '../main.navigator';
import { Button } from '$components';
import { Logo } from '$layout';

export type Props = NativeStackScreenProps<MainStackParamList, 'GetStarted'>;

export default function GetStartedScreen(): JSX.Element {
  const nav = useNavigation<Props['navigation']>();
  const { t } = useTranslation();

  return (
    <YStack pos="relative" mx="auto" height="100%" width="100%" alignItems="center" justifyContent="flex-end">
      {Config.PUBLIC_WHITELABEL === '2xl' && (
        <Image position="absolute" w="100%" h="100%" resizeMode="cover" source={require('../../assets/images/bg.png')} />
      )}
      <XStack flex={1} alignItems="center" mt="$10">
        <Logo size={200} />
      </XStack>

      {Config.PUBLIC_WHITELABEL === '2xl' && (
        <Image w="110%" h="90%" top="$20" resizeMode="contain" source={require('../../assets/images/2xl-welcome.png')} />
      )}

      <YStack
        btlr="$10"
        btrr="$10"
        px="$5"
        pb="$5"
        pt="$3.5"
        bg="$backgroundStrong"
        space="$3.5"
        justifyContent="flex-end"
        width="100%"
        maxWidth={672}>
        <Theme name="primary">
          <SizableText textAlign="center" size="$7" fontWeight="700" color="$color9">
            {Config.PUBLIC_WHITELABEL_NAME}:
          </SizableText>
          <SizableText textAlign="center" size="$7" fontWeight="700" color="$color9">
            {t('get-started.your-ultimate')}
          </SizableText>
          <SizableText textAlign="center" size="$7" fontWeight="700" color="$color9">
            {t('get-started.ai-adventure-companion')}
          </SizableText>
        </Theme>

        <Button theme="primary" fontWeight="600" size="$7" onPress={() => nav.navigate('LanguageSelect', {})}>
          {t('get-started.lets-get-started')}
        </Button>
      </YStack>
    </YStack>
  );
}
