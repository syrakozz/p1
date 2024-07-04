import React from 'react';
import { useController } from 'react-hook-form';
import { Paragraph, ToggleGroup as TGToggleGroup, ToggleGroupProps as TGToggleGroupProps, Text } from 'tamagui';

export type ToggleGroupProps = TGToggleGroupProps & {
  name: string;
  control: any;
  items: { label: string; value: string; description?: string }[];
  defaultValue?: any;
};

export default function ToggleGroup(props: ToggleGroupProps): JSX.Element {
  const { name, control, items, defaultValue, orientation, ...rest } = props;

  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <TGToggleGroup onValueChange={field.onChange} value={field.value} defaultValue={defaultValue} orientation={orientation} {...rest}>
      {items.map(({ label, value, description }) => (
        <TGToggleGroup.Item
          flex={1}
          minWidth={orientation === 'vertical' ? '100%' : undefined}
          value={value}
          key={value}
          alignItems={orientation === 'vertical' ? 'flex-start' : undefined}>
          <Text fontSize={description ? '$6' : undefined} fontWeight={description ? '600' : '400'}>
            {label}
          </Text>
          {description && <Paragraph fontSize="$3">{description}</Paragraph>}
        </TGToggleGroup.Item>
      ))}
    </TGToggleGroup>
  );
}
