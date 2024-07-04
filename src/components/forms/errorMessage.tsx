import React from 'react';
import { Text, TextProps } from 'tamagui';

export type ErrorMessageProps = TextProps;

export default function ErrorMessage(props: ErrorMessageProps): JSX.Element | null {
  return <Text theme="error" color="$color8" fontSize="$4" {...props} />;
}
