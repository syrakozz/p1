import React, { useState } from 'react';
import { LogOut, MoreVertical } from '@tamagui/lucide-icons';
import { Button } from '$components';
import Header, { HeaderProps } from './header';
import { ListItem, Separator, Sheet, YGroup } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { queryClient } from '../../config';
import { useUserStore } from '../services/stores/user.store';

export type OnboardingHeaderProps = HeaderProps;

export default function OnboardingHeader(props: OnboardingHeaderProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { auth } = useUserStore();

  function onLogout() {
    setOpen(false);
    queryClient.clear();
    auth.then(a => a.signOut());
  }

  return (
    <>
      <Sheet modal snapPointsMode="fit" open={open} dismissOnSnapToBottom animation="bouncy" onOpenChange={setOpen}>
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame py="$4" justifyContent="center" alignItems="center">
          <YGroup separator={<Separator />}>
            <YGroup.Item>
              <ListItem size="$6" icon={LogOut} title={t('common.logout')} pressTheme onPress={onLogout} />
            </YGroup.Item>
          </YGroup>
        </Sheet.Frame>
      </Sheet>

      <Header
        rightAction={<Button theme="subtle" size="$3" circular icon={<MoreVertical size="$1.5" />} onPress={() => setOpen(true)} />}
        canGoBack
        {...props}
      />
    </>
  );
}
