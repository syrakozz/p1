import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '$components';
import { Header, MainContainer } from '$layout';
import { View, XStack } from 'tamagui';
import { AppLanguage, SUPPORTED_APP_LANGUAGES } from '../../api/vox.types';
import { useUserStore } from '../../services/stores/user.store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../main.navigator';
import { LanguageButton } from '../account/components/language-button';

export type Props = NativeStackScreenProps<MainStackParamList, 'LanguageSelect'>;

export default function LanguageSelectScreen(): JSX.Element {
  const nav = useNavigation<Props['navigation']>();
  const { t } = useTranslation();
  const { language, setLanguage } = useUserStore();

  function next() {
    nav.navigate('HelpScreen', {helpId: 'help.new-account', nextScreen: 'Login' })
  }

  function onLanguageSelect(lang: AppLanguage) {
    setLanguage(lang);
    next();
  }

  return (
    <MainContainer
      header={<Header title={t('language.hello')} subtitle={t('language.choose')} canGoBack />}
      footer={
        <Button theme="primary" fontWeight="600" size="$7" disabled={!language} onPress={() => {}}>
          {t('common.continue')}
        </Button>
      }>
      <XStack flexWrap="wrap" mx="$-2">
        {SUPPORTED_APP_LANGUAGES.map(lang => (
          <View width="50%" padding="$1.5" key={`language-${lang}`}>
            <LanguageButton isSelected={language === lang} language={lang} onPress={() => onLanguageSelect(lang)} />
          </View>
        ))}
      </XStack>
    </MainContainer>
  );
}
