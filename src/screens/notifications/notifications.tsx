import React from 'react';
import { useTheme } from 'tamagui';
import { NotificationsStack } from './notifications.navigator';
import NotificationListScreen from './notification-list';
import HistoryReviewScreen from '../history/history-review';
import { withIAPContext } from 'react-native-iap';
import BalanceScreen from '../shared/balance';

export default function NotificationsScreen(): JSX.Element {
  const theme = useTheme();

  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.background.val },
      }}>
      <NotificationsStack.Screen name="NotificationList" component={NotificationListScreen} />
      <NotificationsStack.Screen name="HistoryReview" component={HistoryReviewScreen} />
      <NotificationsStack.Screen name="Balance" component={withIAPContext(BalanceScreen)} />
    </NotificationsStack.Navigator>
  );
}
