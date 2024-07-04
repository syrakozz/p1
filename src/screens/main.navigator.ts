import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  GetStarted: {};
  LanguageSelect: {};
  ColorScheme: {};
  Login: {};
  Password: { email: string };
  AgeRestriction: {};
  AccountDetails: {};
  TermsOfUse: {};
  PrivacyPolicy: {};
  ContentPolicy: {};
  ParentalRights: {};
  Main: {};
  HelpScreen: { helpId: string, nextScreen?: string};
};

export const MainStack = createNativeStackNavigator<MainStackParamList>();
