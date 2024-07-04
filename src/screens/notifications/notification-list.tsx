import React, { useMemo, useState } from 'react';
import { AppHeader, MainContainer } from '$layout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NotificationsStackParamList } from './notifications.navigator';
import { useMutateNotification, useQueryNotifications, useQueryProfiles } from '$hooks';
import { Circle, ListItem, Separator, Sheet, Spinner, Text, YGroup, XStack } from 'tamagui';
import { MessageSquare, MoreVertical, Trash } from '@tamagui/lucide-icons';
import { ModeratonCategory, Notification, Profile, moderationMap } from '../../api/vox.types';
import { Button } from '$components';
import dayjs from 'dayjs';
import { useHistoryStore } from '../../services/stores/history.store';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<NotificationsStackParamList, 'NotificationList'>;

export default function NotificationsListScreen(): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const { data, isFetching } = useQueryNotifications();
  const { mutateAsync, isLoading } = useMutateNotification();
  const [selected, setSelected] = useState<Notification>();
  const { setReviewProfile } = useHistoryStore();
  const profiles = useQueryProfiles();

  const sortedByTimestamp = useMemo(
    () =>
      data
        ?.sort((a, b) => b?.timestamp?.localeCompare(a.timestamp))
        .map(notification => ({ notification, timestamp: dayjs(notification.timestamp).fromNow(true) })),
    [data]
  );

  async function onDelete() {
    if (selected) {
      await mutateAsync({ id: selected.id, inactive: true });
      setSelected(undefined);
    }
  }

  async function onView(notification?: Notification) {
    const reviewItem = notification ?? selected;

    if (reviewItem) {
      if (!reviewItem.read) {
        mutateAsync({ id: reviewItem.id, read: true });
      }

      setReviewProfile(profiles.data?.find(profile => profile.id === reviewItem.moderation_value.profile.id) as Profile);

      nav.navigate('HistoryReview', {
        selectedDate: dayjs(reviewItem.moderation_value.session.entry.timestamp).format('YYYY-MM-DD'),
      });

      setSelected(undefined);
    }
  }

  return (
    <MainContainer header={<AppHeader title={t('notifications.notifications')} />}
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.alerts'}/>,
    }}
    
    isFetching={isFetching} fullWidth>
      {sortedByTimestamp?.length ? (
        <YGroup>
          {sortedByTimestamp?.map(({ notification, timestamp }) => {
            if (notification.type === 'moderation') {
              return (
                <ModerationNotification
                  key={notification.id}
                  notification={notification}
                  timestamp={timestamp}
                  onPress={() => onView(notification)}
                  onActionsPress={() => setSelected(notification)}
                />
              );
            }
          })}
        </YGroup>
      ) : (
        <Text textAlign="center" pt="$5">
          {t('notifications.no-notifications')}
        </Text>
      )}

      {!!selected && <Sheet
        modal
        open={!!selected}
        snapPointsMode="fit"
        onOpenChange={(open: boolean) => !open && setSelected(undefined)}
        dismissOnSnapToBottom
        animation="bouncy">
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame py="$4" justifyContent="center" alignItems="center">
          <YGroup separator={<Separator />}>
            <YGroup.Item>
              <ListItem size="$6" icon={MessageSquare} title={t('notifications.view-conversation')} pressTheme onPress={() => onView()} />
            </YGroup.Item>

            <YGroup.Item>
              <ListItem size="$6" icon={isLoading ? <Spinner /> : Trash} title={t('common.delete')} pressTheme onPress={onDelete} />
            </YGroup.Item>
          </YGroup>
        </Sheet.Frame>
      </Sheet>}
    </MainContainer>
  );
}

function ModerationNotification({
  notification,
  timestamp,
  onPress,
  onActionsPress,
}: {
  notification: Notification;
  timestamp: string;
  onPress: () => void;
  onActionsPress: () => void;
}) {
  const { t } = useTranslation();

  const getSubTitle = () =>
    Object.entries(notification.moderation_value.session.entry.moderation?.categories ?? {})
      .filter(([, value]) => value)
      .map(([key]) => t(`common.${(moderationMap[key as keyof typeof moderationMap] ?? key) as ModeratonCategory}`))
      .join(' • ');

  return (
    <YGroup.Item key={notification.id}>
      <ListItem
        size="$4.5"
        title={notification.moderation_value.session.entry.user}
        theme={notification.read ? undefined : 'primary'}
        backgroundColor="$color3"
        subTitle={getSubTitle()}
        pressTheme
        iconAfter={
          <XStack alignItems="center" space="$2">
            <Text opacity={0.6}>{timestamp}</Text>
            <Button chromeless circular theme="inverse" icon={<MoreVertical size="$1" />} onPress={() => onActionsPress()} />
          </XStack>
        }
        icon={
          <Circle bg="$color7" size="$4">
            <Text fontSize="$6" fontWeight="600">
              {notification.moderation_value.profile.name.slice(0, 1).toUpperCase()}
            </Text>
          </Circle>
        }
        onPress={onPress}
      />
    </YGroup.Item>
  );
}
