import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type NotificationsStackParamList = {
  NotificationList: {};
  HistoryReview: { selectedDate: string };
  Balance: {};
};

export const NotificationsStack = createNativeStackNavigator<NotificationsStackParamList>();
