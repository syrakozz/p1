import React, { ReactNode } from 'react';
import { YStack, XStack, Paragraph, Text } from 'tamagui';
import { Button, useConfirm } from '$components';
import { Trash } from '@tamagui/lucide-icons';

export type SectionProps = {
  title?: string;
  description?: string;
  items?: { id: string }[];
  onChange?: (items: { id: string }[]) => void;
  children?: ReactNode;
};

export default function Section({ title, description, items, children, onChange }: SectionProps) {
  const confirm = useConfirm();

  async function onDelete({ id }: { id: string }) {
    const isConfirmed = await confirm({});

    if (isConfirmed) {
      onChange?.(items?.filter(item => item.id !== id) || []);
    }
  }

  return (
    <YStack>
      <XStack alignItems="flex-start" justifyContent="space-between">
        <YStack>
          <Text fontSize="$4" fontWeight="600" mb="$1">
            {title}
          </Text>
          <Paragraph fontSize="$4" color="$color11" mb="$3">
            {description}
          </Paragraph>
        </YStack>
        {children}
      </XStack>
      {items?.map(item => (
        <XStack justifyContent="space-between" alignItems="center" key={item.id}>
          <Text>{item.id}</Text>
          <Button chromeless circular theme="inverse" icon={<Trash />} onPress={() => onDelete(item)} />
        </XStack>
      ))}
    </YStack>
  );
}
