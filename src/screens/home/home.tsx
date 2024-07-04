import React from 'react';
import { useTheme } from 'tamagui';
import { withIAPContext } from 'react-native-iap';
import HomeOverviewScreen from './home-overview';
import ProfileOverviewScreen from './profile-overview';
import ProfilePersonalDetailsScreen from './profile-personal-details';
import ProfileInterestsScreen from './profile-interests';
import { HomeStack } from './home.navigator';
import ProfileModerationScreen from './profile-moderation';
import ProfileContentCustomizationsScreen from './profile-content-customizations';
import BtPairingScreen from '../account/bt-pairing';
import BalanceScreen from '../shared/balance';
import ChatScreen from './chat';
import TalkingModeScreen from './talking-mode';


export default function ProfileScreen(): JSX.Element {
  const theme = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.background.val },
      }}>
      <HomeStack.Screen name="HomeOverview" component={HomeOverviewScreen} />
      <HomeStack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
      <HomeStack.Screen name="ProfilePersonalDetails" component={ProfilePersonalDetailsScreen} />

      <HomeStack.Screen name="ProfileInterests" component={ProfileInterestsScreen} />
      <HomeStack.Screen name="ProfileModeration" component={ProfileModerationScreen} />
      <HomeStack.Screen name="ProfileContentCustomizations" component={ProfileContentCustomizationsScreen} />
      <HomeStack.Screen name="BtPairing" component={BtPairingScreen} />
      
      <HomeStack.Screen name="Balance" component={withIAPContext(BalanceScreen)} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
      <HomeStack.Screen name="TalkingMode" component={TalkingModeScreen} />
    </HomeStack.Navigator>
  );
}
