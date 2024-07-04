import React, { ReactNode } from 'react';
import { X } from '@tamagui/lucide-icons';
import { Button, Dialog as TGDialog, Unspaced, XStack } from 'tamagui';

export type DialogProps = {
  isOpen?: boolean;
  title?: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  leftActions?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export default function Dialog({ isOpen, title, description, leftActions, actions, trigger, children, onOpenChange }: DialogProps) {
  return (
    <TGDialog modal open={isOpen} onOpenChange={onOpenChange}>
      <TGDialog.Trigger asChild>{trigger}</TGDialog.Trigger>

      <TGDialog.Portal style={{backgroundColor:'rgba(0, 0, 0, 0.7)'}}>

        <TGDialog.Content w="90%" bordered elevate key="content" gap="$4" size="$3.5">
          <TGDialog.Title fontSize="$8">{title}</TGDialog.Title>
          {description && <TGDialog.Description>{description}</TGDialog.Description>}
          {children}
          <XStack justifyContent={
            leftActions ? 'space-between' : 'flex-end' 
          } >
            {leftActions && (
              <XStack alignSelf="flex-start" mt="$1.5" gap="$2">
                {leftActions}
              </XStack>
            )}
            {actions && (
              <XStack alignSelf="flex-end" mt="$1.5" gap="$2">
                {actions}
              </XStack>
            )}
          </XStack>
          <Unspaced>
            <TGDialog.Close asChild>
              <Button
                position="absolute"
                chromeless
                theme="inverse"
                top="$4.5"
                right="$3.5"
                size="$3.5"
                circular
                icon={<X size="$1.5" />}
              />
            </TGDialog.Close>
          </Unspaced>
        </TGDialog.Content>
      </TGDialog.Portal>
    </TGDialog>
  );
}
