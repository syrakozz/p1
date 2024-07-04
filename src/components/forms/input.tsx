import React from 'react';
import { useController } from 'react-hook-form';
import { Input as TGInput, InputProps as TGInputProps, YStack } from 'tamagui';
import ErrorMessage from './errorMessage';

export type InputProps = TGInputProps & {
  name: string;
  control: any;
  errorMessage?: string;
};

export default function Input(props: InputProps): JSX.Element {
  const { name, control, errorMessage, size, defaultValue, disabled, ...rest } = props;

  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <YStack>
      <TGInput
        opacity={disabled ? 0.6 : undefined}
        onChangeText={field.onChange}
        value={field.value}
        disabled={disabled}
        size={size}
        defaultValue={defaultValue}
        {...rest}
      />
      {errorMessage && (
        <ErrorMessage mt="$1.5" marginHorizontal={size}>
          {errorMessage}
        </ErrorMessage>
      )}
    </YStack>
  );
}
