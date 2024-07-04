import Config from 'react-native-config';
import { Button } from '$components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'tamagui';
import { HomeStackParamList } from '../home.navigator';
import { useActiveProfileStore } from '../../../services/stores/profile.store';

type Props = NativeStackScreenProps<HomeStackParamList>;

export default function ChatButton() {
  const { t } = useTranslation();
  const { activeProfile } = useActiveProfileStore();
  const nav = useNavigation<Props['navigation']>();

  function onChatNow() {
    nav.navigate('Chat', {});
  }

  if (activeProfile && Config.PUBLIC_WHITELABEL === 'magic') {
    return (
      <Button theme="primary" size="$7" justifyContent="center" onPress={onChatNow}>
        <Text fontSize="$7">
          {t('profile.chat-now-as')}: {activeProfile.name}
        </Text>
      </Button>
    );
  }
}
