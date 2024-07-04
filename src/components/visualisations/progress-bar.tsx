import React from 'react';
import { Text, View } from 'tamagui';

type ProgressBarProps = {
  percentage?: number;
  theme?: 'primary' | 'success' | 'warning' | 'error';
};

export default function ProgressBar({ percentage, theme = 'primary' }: ProgressBarProps): JSX.Element {
  const progress = percentage || 0;

  return (
    <View borderColor="$borderColor" br="$4" borderWidth={1} pos="relative" h="$4.5">
      <View theme={theme} bg="$color8" h="100%" br="$4" width={`${progress}%`} />
      <Text pos="absolute" top={15} left={`${progress / 2}%`}>
        {percentage}%
      </Text>
    </View>
  );
}
