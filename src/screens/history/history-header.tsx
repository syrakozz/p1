import React, { useEffect, useState } from 'react';
import { Check, MoreVertical } from '@tamagui/lucide-icons';
import { Button } from '$components';
import { ListItem, Text, Separator, Sheet, YGroup, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { AppHeader, HeaderProps } from '$layout';
import { useQueryProfiles } from '$hooks';
import { useHistoryStore } from '../../services/stores/history.store';
import { Profile } from '../../api/vox.types';
import { useActiveProfileStore } from '../../services/stores/profile.store';

export type OnboardingHeaderProps = HeaderProps;

export default function HistoryHeader(props: OnboardingHeaderProps) {
  const { t } = useTranslation();
  const profiles = useQueryProfiles();
  const { activeProfile } = useActiveProfileStore();
  const [open, setOpen] = useState(false);
  const { reviewProfile, setReviewProfile } = useHistoryStore();

  useEffect(() => {
    if (activeProfile) {
      setReviewProfile(activeProfile);
    }
  }, [activeProfile, setReviewProfile]);

  function onSelect(profile: Profile) {
    setReviewProfile(profile);
    setOpen(false);
  }

  return (
    <>
      <Sheet modal snapPointsMode="fit" open={open} dismissOnSnapToBottom animation="bouncy" onOpenChange={setOpen}>
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame py="$4" justifyContent="center" alignItems="center" space="$5">
          <YStack w="100%" space="$2.5">
            <Text fontSize="$6" fontWeight="600" ml="$6">
              {t('history.select-profile-to-review')}
            </Text>
            <YGroup separator={<Separator />}>
              {profiles.data?.map(profile => (
                <YGroup.Item key={profile.id}>
                  <ListItem
                    size="$6"
                    iconAfter={profile.id === reviewProfile?.id ? Check : null}
                    title={profile.name}
                    pressTheme
                    onPress={() => onSelect(profile)}
                  />
                </YGroup.Item>
              ))}
            </YGroup>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <AppHeader
        rightAction={<Button theme="subtle" size="$3" circular icon={<MoreVertical size="$1.5" />} onPress={() => setOpen(true)} />}
        {...props}
      />
    </>
  );
}
