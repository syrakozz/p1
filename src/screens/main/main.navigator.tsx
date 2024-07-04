import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Home: {};
  History: {};
  Notifications: {};
  Account: {};
  // Help: {};
};

export const MainTab = createBottomTabNavigator<TabParamList>();
