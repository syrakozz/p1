import React from 'react';
import { Card, Text, ThemeableStack, ThemeableStackProps } from 'tamagui';
import { AppLanguage } from '../../../api/vox.types';

export type LanguageButtonProps = ThemeableStackProps & {
  language: AppLanguage;
  isSelected?: boolean;
};

export const UI_LANGUAGES: Record<AppLanguage, { title: string; salute: string }> = {
  en: { title: 'English', salute: 'Hello, Welcome to 2XL' },
  es: { title: 'Español', salute: 'Hola bienveidoa 2XL' },
  de: { title: 'Deutsch', salute: 'Hallo, wilkommen zu 2XL' },
  fr: { title: 'Français', salute: 'Bonjour, bienvenue chez 2XL' },
  it: { title: 'Italiano', salute: 'Ciao, benvenuto in 2XL' },
  bg: { title: 'Български', salute: 'Здравейте, Добре дошли в 2XL' },
  cz: { title: 'Bulharský', salute: 'Ahoj, Vítejte v 2XL' },
  da: { title: 'Dansk', salute: 'Hej, velkommen til 2XL' },
  sv: { title: 'Svenska', salute: 'Hej, välkommen till 2XL' },
  fi: { title: 'Suomi', salute: 'Hei, tervetuloa 2XL' },
  nl: { title: 'Nederlands', salute: 'Hallo, welkom bij 2XL' },
  el: { title: 'Ελληνικά', salute: 'Γεια σου, καλωσήρθες στο 2XL' },
  pl: { title: 'Polski', salute: 'Cześć, witaj w 2XL' },
  pt: { title: 'Português', salute: 'Olá, bem-vindo ao 2XL' },
  ro: { title: 'Română', salute: 'Salut, bun venit la 2XL' },
  ru: { title: 'Русский', salute: 'Привет, добро пожаловать в 2XL' },
};

export function LanguageButton({ language, isSelected, onPress, ...rest }: LanguageButtonProps) {
  return (
    <ThemeableStack pressTheme {...rest} theme={isSelected ? 'active' : null}>
      <Card
        size="$4"
        bordered
        width="100%"
        pressTheme
        theme={isSelected ? 'active' : null}
        borderWidth={4}
        {...(isSelected && {
          borderColor: '$blue10',
        })}
        onPress={onPress}>
        <Card.Header px="$3" pt="$3" minHeight={85}>
          <Text fontSize="$3" color={isSelected ? '$blue10' : undefined}>
            {UI_LANGUAGES[language].salute}
          </Text>
        </Card.Header>
        <Card.Footer px="$3" pb="$3">
          <Text fontSize="$6" fontWeight="bold" color={isSelected ? '$blue10' : undefined}>
            {UI_LANGUAGES[language].title}
          </Text>
        </Card.Footer>
      </Card>
    </ThemeableStack>
  );
}
