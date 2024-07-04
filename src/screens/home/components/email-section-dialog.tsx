import React, { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Dialog, Input } from '$components';
import { HelpCircle, Plus } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import HelpDialog from '../../help/help-dialog';

type EmailSectionDialogProps = {
  emails?: { id: string }[];
  onChange?: (emails: { id: string }[]) => void;
  children?: ReactNode;
};

export default function EmailSectionDialog({ emails, onChange }: EmailSectionDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = z.object({
    email: z
      .string()
      .nonempty(t('profile.email-required'))
      .email(t('profile.email-invalid'))
      .refine(val => !emails?.find(({ id }) => val === id), t('profile.email-already-exists')),
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
      email: '',
    },
  });

  function close() {
    reset();
    setIsOpen(false);
  }

  function onSubmit({ email }: Values) {
    onChange?.([...(emails || []), { id: email }]);
    close();
  }

  
  return (
    <Dialog
      title={t('profile.notification-recipient')}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={<Button chromeless circular theme="inverse" size="$2" icon={<Plus size="$1.5" />} />}
      leftActions={<>
        <HelpDialog 
        triggerChild={ <Button chromeless icon={<HelpCircle color='#ff6e40' size={30} />} size="$3" />}
        helpId={'help.moderation-recipient'}/>
  
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
      <Input size="$5" control={control} name="email" errorMessage={errors.email?.message} placeholder={t('common.email')} />
    </Dialog>
  );
}
