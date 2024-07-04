import React from 'react';
import { ChevronRight } from '@tamagui/lucide-icons';
import { ButtonProps, Circle, Text, View } from 'tamagui';
import { Button } from '$components';

export type NumberedStepProps = ButtonProps & {
  step: number;
};

export default function NumberedStep({ step, disabled, ...rest }: NumberedStepProps) {
  return (
    <Button
      disabled={disabled}
      fontWeight="500"
      variant="outlined"
      borderStyle="dashed"
      theme="inverse"
      fontSize="$5"
      themeShallow
      pressTheme
      size="$7"
      px="$5"
      justifyContent="flex-start"
      icon={
        <View theme="primary">
          <Circle bg="$color7" size="$4">
            <Text fontSize="$6" fontWeight="600">
              {step}
            </Text>
          </Circle>
        </View>
      }
      iconAfter={
        <View ml="auto">
          <ChevronRight />
        </View>
      }
      {...rest}
    />
  );
}
