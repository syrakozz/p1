import React, { useState } from 'react';
import { AlertDialog, YStack, XStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import Button from '../button/button';

export type ConfirmDialogProps = {
  isOpen?: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  callback?: (() => Promise<void> | void) | void;
};

export default function ConfirmDialog({ isOpen, title, description, confirmText, onCancel, onConfirm, callback }: ConfirmDialogProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  async function onResponse(isConfirmed: boolean) {
    if (isLoading) {
      return;
    }

    if (isConfirmed && callback) {
      setIsLoading(true);
      try {
        await callback();
      } finally {
        setIsLoading(false);
      }
    }

    isConfirmed ? onConfirm?.() : onCancel?.();
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onResponse}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay key="overlay" opacity={0.5} />
        <AlertDialog.Content w="90%" bordered elevate key="content" x={0} scale={1} opacity={1} y={0}>
          <YStack space>
            <AlertDialog.Title fontSize="$8">{title || t('common.are-you-sure')}</AlertDialog.Title>
            {description && <AlertDialog.Description>{description}</AlertDialog.Description>}
            <XStack space="$3" justifyContent="flex-end">
              <Button chromeless theme="inverse" fontWeight="600" onPress={() => onResponse(false)}>
                {t('common.cancel')}
              </Button>
              <Button loading={isLoading} theme="primary" fontWeight="600" onPress={() => onResponse(true)}>
                {confirmText || t('common.yes')}
              </Button>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
