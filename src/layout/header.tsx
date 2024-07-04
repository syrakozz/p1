import React, { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, SizableText, View, XStack } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import Logo from './logo';
import Config from 'react-native-config';

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  logo?: boolean;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  canGoBack?: boolean;
  showBalance?: boolean;
};

export default function Header({ title, subtitle, leftAction, rightAction, logo = false, canGoBack = false }: HeaderProps): JSX.Element {
  const nav = useNavigation();

  return (
    <View>
      <XStack justifyContent="space-between" px="$2.5" pt="$3" pb="$3.5" space="$0.25">
        <View justifyContent="center" alignItems="center" height="$3.5" minWidth="$3.5">
          {canGoBack ? (
            <Button theme="subtle" size="$3" circular icon={<ChevronLeft size="$1.5" />} onPress={() => nav.goBack()} />
          ) : (
            leftAction ?? (!logo && <Logo size={56} />)
          )}
        </View>
        <View flex={1} justifyContent="center" alignItems="center" theme={Config.PUBLIC_WHITELABEL === '2xl' ? 'dark' : undefined}>
          {logo && <Logo />}
          {title && (
            <SizableText textAlign="center" size="$7" fontWeight="bold" ellipse={!logo}>
              {title}
            </SizableText>
          )}
        </View>
        <View justifyContent="center" height="$3.5" minWidth="$3.5">
          {rightAction}
        </View>
      </XStack>

      {subtitle && (
        <SizableText textAlign="center" size="$4" theme={Config.PUBLIC_WHITELABEL === '2xl' ? 'dark' : undefined}>
          {subtitle}
        </SizableText>
      )}
    </View>
  );
}
