import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  HomeOverview: {};
  ConnectRobotAssist: {};
  ProfileOverview: { profileId: string };
  ProfileCreateAssist: {};
  ProfilePersonalDetails: { profileId?: string };
  ProfileInterests: { profileId: string };
  ProfileModeration: { profileId: string };
  ProfileContentCustomizations: { profileId: string };
  BtPairing: {};
  Balance: {};
  Chat: {};
  TalkingMode: {};
};

export const HomeStack = createNativeStackNavigator<HomeStackParamList>();
