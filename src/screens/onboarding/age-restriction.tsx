import React, { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingHeader, MainContainer } from '$layout';
import { MainStackParamList } from '../main.navigator';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Circle, Input, Paragraph, Text, XStack, YStack } from 'tamagui';
import { Button } from '$components';
import { useUserStore } from '../../services/stores/user.store';

type Props = NativeStackScreenProps<MainStackParamList, 'AgeRestriction'>;

function getRandomInt(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AgeRestrictionScreen() {
  const nav = useNavigation<Props['navigation']>();
  const { t } = useTranslation();
  const nums = useRef([getRandomInt(), getRandomInt(), getRandomInt()]);
  const [response, setResponse] = useState('');
  const { auth } = useUserStore();

  useEffect(() => {
    if (nav.canGoBack()) {
      nav.popToTop();
    }
  }, [nav]);

  function handleSubmit() {
    if (+response === nums.current.reduce((acc, curr) => acc + curr, 0)) {
      nav.navigate('AccountDetails', {});
    } else {
      auth.then(a => a.signOut());
    }
  }

  return (
    <MainContainer
      header={<OnboardingHeader title={t('age-restriction.age-restriction')} logo canGoBack={false} />}
      footer={
        <Button theme="primary" fontWeight="600" size="$7" onPress={handleSubmit} disabled={!response}>
          {t('common.continue')}
        </Button>
      }>
      <YStack flex={1} alignItems="center">
        <Circle theme="primary" bg="$color4" size="$13">
          <Text fontSize="$10" fontWeight="600">
            13+
          </Text>
        </Circle>
        <Paragraph mt="$3.5" color="$color11" fontSize="$5" textAlign="center">
          {t('age-restriction.this-is-for-grownups')}
          {'\n'}
          {t('age-restriction.press-the-button')}
        </Paragraph>

        <XStack my="$3.5" alignItems="center" space="$3">
          <Text fontSize="$7">{nums.current.join(' + ')} =</Text>
          <Input value={response} keyboardType="numeric" onChangeText={setResponse} />
        </XStack>

        <Paragraph color="$color11" fontSize="$4" textAlign="center">
          {t('age-restriction.wrong-response')}
        </Paragraph>
        <></>
      </YStack>
    </MainContainer>
  );
}
