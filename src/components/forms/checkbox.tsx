import React, { useMemo } from 'react';
import { Check } from '@tamagui/lucide-icons';
import { Checkbox as TGChecbox, CheckboxProps, Label, XStack } from 'tamagui';
import { useController } from 'react-hook-form';

type Props = CheckboxProps & {
  control: any;
  name: string;
};

let uuid = 1;

export default function Checkbox(props: Props): JSX.Element {
  const { control, name, children, ...rest } = props;
  const id = useMemo(() => `${uuid++}`, []);
  const { field } = useController({
    control,
    name,
  });
  const checked = !!field.value;

  return (
    <XStack>
      <TGChecbox id={id} p="$0" checked={checked} onCheckedChange={field.onChange} size="$6" {...rest}>
        <TGChecbox.Indicator>
          <Check size="$1.5" />
        </TGChecbox.Indicator>
      </TGChecbox>

      <Label htmlFor={id} pl="$2.5" flex={1} flexWrap="wrap" lineHeight="$3">
        {children}
      </Label>
    </XStack>
  );
}
