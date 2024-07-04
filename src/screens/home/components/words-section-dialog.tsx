import React, { ReactNode, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button, Dialog, Input } from '$components';
import { HelpCircle, Plus } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';
import HelpDialog from '../../help/help-dialog';

type WordsSectionDialogProps = {
  words?: { id: string }[];
  onChange?: (words: { id: string }[]) => void;
  children?: ReactNode;
};

export default function WordsSectionDialog({ words, onChange }: WordsSectionDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = z.object({
    word: z
      .string()
      .nonempty(t('profile.word-required'))
      .refine(val => !words?.find(({ id }) => val === id), t('profile.word-already-exists')),
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
      word: '',
    },
  });

  function close() {
    reset();
    setIsOpen(false);
  }

  function onSubmit({ word }: Values) {
    onChange?.([...(words || []), { id: word }]);
    close();
  }



  return (
    <Dialog
      title={t('profile.add-new-word')}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={<Button chromeless circular theme="inverse" size="$2" icon={<Plus size="$1.5" />} />}
      leftActions={<>
        <HelpDialog 
        triggerChild={ <Button chromeless icon={<HelpCircle color={'#ff6e40'} size={30} />} size="$3" />}
        helpId={'help.moderation-word'}/>
      </>}
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
      <Input size="$5" control={control} name="word" errorMessage={errors.word?.message} placeholder={t('common.word')} />
    </Dialog>
  );
}
