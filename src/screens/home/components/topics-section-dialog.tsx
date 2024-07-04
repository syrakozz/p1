import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button, Dialog, Input } from '$components';
import { HelpCircle, Plus } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';
import HelpDialog from '../../help/help-dialog';

type TopicsSectionDialogProps = {
  topics?: { id: string }[];
  onChange?: (topics: { id: string }[]) => void;
  type: string;
};

export default function TopicsSectionDialog({ topics, onChange, type }: TopicsSectionDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = z.object({
    topic: z
      .string()
      .nonempty(t('profile.topic-required'))
      .refine(val => !topics?.find(({ id }) => val === id), t('profile.topic-already-exists')),
  });

  type Values = z.infer<typeof validationSchema>;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      topic: '',
    },
  });

  function close() {
    reset();
    setIsOpen(false);
  }

  function onSubmit({ topic }: Values) {
    onChange?.([...(topics || []), { id: topic }]);
    close();
  }

  return (
    <Dialog
      title={t('profile.add-new-topic')}
      isOpen={isOpen}

      onOpenChange={setIsOpen}
      trigger={<Button chromeless circular theme="inverse" size="$2" icon={<Plus size="$1.5" />} />}
      leftActions={<>
       <HelpDialog 
        triggerChild={ <Button chromeless theme="inverse"  icon={<HelpCircle color={'#ff6e40'} size={30} />} size="$3" />}
        helpId={`help.moderation-${type}`}/>
      </>
      }
      actions={
        <>
          <Button size="$4" chromeless fontWeight="600" theme="inverse" onPress={close}>
            {t('common.cancel')}
          </Button>
          <Button theme="primary" size="$4" fontWeight="600" onPress={handleSubmit(onSubmit)}>
            {t('common.add')}
          </Button>
        </>
      }>
      <Input size="$5" control={control} name="topic" errorMessage={errors.topic?.message} placeholder={t('common.topic')} />
    </Dialog>
  );
}
