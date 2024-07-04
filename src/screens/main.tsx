import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'tamagui';
import { MainStack } from './main.navigator';
import GetStartedScreen from './onboarding/get-started';
import LoginScreen from './login/login';
import AccountDetailsScreen from './onboarding/account-details';
import MainScreen from './main/main';
import PasswordScreen from './password/password';
import { useLayoutData } from '$hooks';
import LanguageSelectScreen from './onboarding/language-select';
import AgeRestrictionScreen from './onboarding/age-restriction';
import { LockDialog, useLockScreenStore } from '$components';
import HelpWrapper from './help/help-wrapper';

export default function MainStackNavigation(): JSX.Element {
  const theme = useTheme();
  const layout = useLayoutData();
  const lockScreenStore = useLockScreenStore();

  return (
    <NavigationContainer>
      <LockDialog isOpen={lockScreenStore.isOpen} {...lockScreenStore.props} />

      <MainStack.Navigator
        screenOptions={{
          animation: 'none',
          headerShown: false,
          contentStyle: { backgroundColor: theme.background.val },
        }}>
        {layout.isFetched ? (
          <>
            {layout.data.preferences?.['2xl:isFirstLogin'] && (
              <>
                <MainStack.Screen name="AgeRestriction" component={AgeRestrictionScreen} />
                <MainStack.Screen name="AccountDetails" component={AccountDetailsScreen} />
              </>
            )}
            <MainStack.Screen name="Main" component={MainScreen} />
          </>
        ) : (
          <>
            <MainStack.Screen name="GetStarted" component={GetStartedScreen} />
            <MainStack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <MainStack.Screen name="HelpScreen" component={HelpWrapper} />
            <MainStack.Screen name="Login" component={LoginScreen} />
            <MainStack.Screen name="Password" component={PasswordScreen} />
          </>
        )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
