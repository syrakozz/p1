import React from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { Paragraph, SizableText, Switch, Text, View, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Button } from '$components';
import { Moon, Sun } from '@tamagui/lucide-icons';
import { AppHeader, MainContainer } from '$layout';
import { useMutatePreferences, useQueryPreferences } from '$hooks';

export default function ColorSchemeScreen(): JSX.Element {
  const { t } = useTranslation();
  const systemColorScheme = useColorScheme();
  const { data: preferences } = useQueryPreferences();
  const { mutate } = useMutatePreferences();

  function onChange(colorScheme: ColorSchemeName) {
    mutate({ '2xl:colorScheme': colorScheme });
  }

  return (
    <MainContainer header={<AppHeader title={t('color-scheme.appearance')} canGoBack  showBalance={true}  />}>
      <YStack flex={1} space="$3.5">
        <XStack justifyContent="center" px="$5" width="100%" space="$3.5" my="$5">
          <View flex={1} alignItems="center">
            <Button
              theme={preferences?.['2xl:colorScheme'] === 'light' ? 'primary' : 'subtle'}
              size="$8"
              onPress={() => onChange('light')}
              icon={<Sun size="$3" />}
              circular
            />
            <SizableText pt="$3.5" size="$5" fontWeight="500" color="$color11">
              {t('color-scheme.light')}
            </SizableText>
          </View>
          <View flex={1} alignItems="center">
            <Button
              theme={preferences?.['2xl:colorScheme'] === 'dark' ? 'primary' : 'subtle'}
              size="$8"
              onPress={() => onChange('dark')}
              icon={<Moon size="$3" />}
              circular
            />
            <SizableText pt="$3.5" size="$5" fontWeight="500" color="$color11">
              {t('color-scheme.dark')}
            </SizableText>
          </View>
        </XStack>

        <Paragraph textAlign="center" color="$color11">
          {t('color-scheme.choose-a-color')}
        </Paragraph>

        <YStack space="$2" mt="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="600">
              {t('color-scheme.use-system')} {systemColorScheme && <>({t(`color-scheme.${systemColorScheme}`)})</>}
            </Text>
            <Switch checked={!preferences?.['2xl:colorScheme']} onCheckedChange={checked => checked && onChange(null)}>
              <Switch.Thumb theme="primary" animation="quick" />
            </Switch>
          </XStack>
        </YStack>
      </YStack>
    </MainContainer>
  );
}
