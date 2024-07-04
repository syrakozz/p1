import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, MainContainer } from '$layout';
import { View, XStack } from 'tamagui';
import { useQueryPreferences, useMutatePreferences } from '$hooks';
import { SUPPORTED_APP_LANGUAGES, AppLanguage } from '../../api/vox.types';
import { LanguageButton } from './components/language-button';

export default function LanguageSelectScreen(): JSX.Element {
  const { t } = useTranslation();
  const { data: preferences } = useQueryPreferences();
  const { mutate } = useMutatePreferences();

  function onChange(language: AppLanguage) {
    mutate({ '2xl:language': language });
  }

  return (
    <MainContainer header={<AppHeader title={t('account.language')} subtitle={t('language.choose')} canGoBack  showBalance={true}  />}>
      <XStack flexWrap="wrap" mx="$-2">
        {SUPPORTED_APP_LANGUAGES.map(language => (
          <View width="50%" padding="$1.5" key={`language-${language}`}>
            <LanguageButton
              language={language}
              isSelected={preferences?.['2xl:language'] === language}
              onPress={() => onChange(language)}
            />
          </View>
        ))}
      </XStack>
    </MainContainer>
  );
}
