import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AccountStackParamList = {
  AccountOverview: {};
  BtPairing: {};
  Status: {};
  ColorScheme: {};
  LanguageSelect: {};
  Emotions: {};
  Balance: {};
  AccountDetails: {};
  PinOverview: {};
  ChangePin: {};
};

export const AccountStack = createNativeStackNavigator<AccountStackParamList>();
