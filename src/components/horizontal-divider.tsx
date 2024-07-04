import React from 'react';
import { Text, Separator, XStack } from 'tamagui';

export default function HorizontalDivider({ text }: { text: string }): JSX.Element {
  return (
    <XStack space="$3.5" alignItems="center">
      <Separator backgroundColor="$color11" borderColor="$color8" />
      <Text color="$color11">{text}</Text>
      <Separator backgroundColor="$color11" borderColor="$color8" />
    </XStack>
  );
}
