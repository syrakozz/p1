import React from 'react';
import { useTheme } from 'tamagui';
import { HistoryStack } from './history.navigator';
import HistoryCalendarScreen from '../history/history-calendar';
import HistoryReviewScreen from './history-review';
import { withIAPContext } from 'react-native-iap';
import BalanceScreen from '../shared/balance';

export default function History(): JSX.Element {
  const theme = useTheme();

  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.background.val },
      }}>
      <HistoryStack.Screen name="HistoryCalendar" component={HistoryCalendarScreen} />
      <HistoryStack.Screen name="HistoryReview" component={HistoryReviewScreen} />
      <HistoryStack.Screen name="Balance" component={withIAPContext(BalanceScreen)} />
    </HistoryStack.Navigator>
  );
}
