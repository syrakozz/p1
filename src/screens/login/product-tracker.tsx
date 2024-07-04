import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, HorizontalDivider } from '$components';

export function ProductTracker(): JSX.Element {
  const { t } = useTranslation();

  // TODO validation
  const validationSchema = z.object({
    trackerId: z
      .string({
        errorMap: () => ({ message: t('product.please-enter-tracking-id') }),
      })
      .min(1),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      trackerId: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('TODO this needs to be implemented', JSON.stringify(data));
  };

  return (
    <YStack space="$3.5">
      <Text textAlign="center">{t('product.waiting-on-2xl')}</Text>
      <XStack space="$4" justifyContent="space-between">
        <YStack flex={1}>
          <Input
            size="$3"
            control={control}
            name="trackerId"
            placeholder={t('product.enter-tracking-id')}
            errorMessage={errors.trackerId?.message}
          />
        </YStack>
        <Button width="25%" size="$3" theme="subtle" onPress={handleSubmit(onSubmit)}>
          {t('product.track')}
        </Button>
      </XStack>
    </YStack>
  );
}

export default function ProductTrackerWithDivider(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <View my="$4">
        <HorizontalDivider text={t('product.or')} />
      </View>
      <ProductTracker />
    </>
  );
}
