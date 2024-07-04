import React, { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { Adapt, Sheet, Select as TGSelect, SelectProps as TGSelectProps, YStack } from 'tamagui';
import ErrorMessage from './errorMessage';

export type SelectProps = TGSelectProps & {
  name: string;
  control: any;
  selectLabel: string;
  items: { label: string; value: string }[];
  errorMessage?: string;
};

Select.Trigger = TGSelect.Trigger;
Select.Value = TGSelect.Value;
Select.Content = TGSelect.Content;
Select.ScrollDownButton = TGSelect.ScrollDownButton;
Select.ScrollUpButton = TGSelect.ScrollUpButton;
Select.Viewport = TGSelect.Viewport;
Select.Group = TGSelect.Group;
Select.Item = TGSelect.Item;
Select.ItemIndicator = TGSelect.ItemIndicator;
Select.ItemText = TGSelect.ItemText;
Select.Label = TGSelect.Label;

export default function Select(props: SelectProps): JSX.Element {
  const { name, control, errorMessage, size, defaultValue, items, selectLabel, onValueChange, ...rest } = props;

  function handleValueChange(value: string) {
    field.onChange(value);
    onValueChange?.(value);
  }

  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <YStack>
      <TGSelect defaultValue={defaultValue} value={field.value} size={size} onValueChange={handleValueChange} {...rest}>
        <Adapt platform="touch">
          <Sheet
            native
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          </Sheet>
        </Adapt>

        <TGSelect.Content zIndex={200000}>
          <TGSelect.ScrollUpButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
          </TGSelect.ScrollUpButton>

          <TGSelect.Viewport minWidth={200}>
            <TGSelect.Group py="$4">
              <TGSelect.Label>{selectLabel}</TGSelect.Label>
              {useMemo(
                () =>
                  items.map(({ value, label }, i) => (
                    <TGSelect.Item index={i} key={value} value={value}>
                      <TGSelect.ItemText>{label}</TGSelect.ItemText>
                      <TGSelect.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </TGSelect.ItemIndicator>
                    </TGSelect.Item>
                  )),
                [items]
              )}
            </TGSelect.Group>
          </TGSelect.Viewport>

          <TGSelect.ScrollDownButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
          </TGSelect.ScrollDownButton>
        </TGSelect.Content>

        <TGSelect.Trigger iconAfter={ChevronDown}>
          <TGSelect.Value placeholder={selectLabel} />
        </TGSelect.Trigger>
      </TGSelect>
      {errorMessage && (
        <ErrorMessage mt="$1.5" marginHorizontal={size}>
          {errorMessage}
        </ErrorMessage>
      )}
    </YStack>
  );
}
