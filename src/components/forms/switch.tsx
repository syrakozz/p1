import React from 'react';
import { useController } from 'react-hook-form';
import { Switch as TGSwitch, SwitchProps as TGSwitchProps } from 'tamagui';

export type SwitchProps = TGSwitchProps & {
  name: string;
  control: any;
  errorMessage?: string;
};

Switch.Thumb = TGSwitch.Thumb;

export default function Switch(props: SwitchProps): JSX.Element {
  const { name, control, size, ...rest } = props;

  const { field } = useController({
    control,
    name,
  });

  return <TGSwitch onCheckedChange={field.onChange} checked={field.value} size={size} {...rest} />;
}
