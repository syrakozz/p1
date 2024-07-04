import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type HistoryStackParamList = {
  HistoryCalendar: {};
  HistoryReview: { selectedDate: string };
  Balance: {};
};

export const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
