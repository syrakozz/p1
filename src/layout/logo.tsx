import React from 'react';
import { StackProps, View, useTheme } from 'tamagui';
import LogoIcon from '../assets/images/app/logo.svg';

export type LogoProps = StackProps & { size?: number };

export default function Logo({ size = 128, ...props }: LogoProps) {
  const theme = useTheme();

  return (
    <View {...props}>
      <LogoIcon color={theme.color12.val} width={size} height={size} />
    </View>
  );
}
