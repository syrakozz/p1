import React from 'react';
import { useTheme } from 'tamagui';
import { AccountStack } from './account.navigator';
import AccountOverviewScreen from './account-overview';
// import BtPairingScreen from './bt-pairing';
import StatusScreen from './status';
import ColorSchemeScreen from './color-scheme';
import LanguageSelectScreen from './language-select';
import EmotionsScreen from './emotions-screen';
import { withIAPContext } from 'react-native-iap';
import BalanceScreen from '../shared/balance';
import AccountDetailsScreen from './account-details';
import PinOverviewScreen from './pin-overview';
import ChangePinScreen from './change-pin';

export default function AccountScreen(): JSX.Element {
  const theme = useTheme();

  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.background.val },
      }}>
      <AccountStack.Screen name="AccountOverview" component={AccountOverviewScreen} />
      {/* <AccountStack.Screen name="BtPairing" component={BtPairingScreen} /> */}
      <AccountStack.Screen name="Status" component={StatusScreen} />
      <AccountStack.Screen name="ColorScheme" component={ColorSchemeScreen} />
      <AccountStack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <AccountStack.Screen name="Emotions" component={EmotionsScreen} />
      <AccountStack.Screen name="Balance" component={withIAPContext(BalanceScreen)} />
      <AccountStack.Screen name="AccountDetails" component={AccountDetailsScreen} />
      <AccountStack.Screen name="PinOverview" component={PinOverviewScreen} />
      <AccountStack.Screen name="ChangePin" component={ChangePinScreen} />
    </AccountStack.Navigator>
  );
}
