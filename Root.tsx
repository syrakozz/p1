import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import SplashScreen from 'react-native-splash-screen';
import './src/i18n/i18n.config';
import { useUserStore } from './src/services/stores/user.store';
import MainStackNavigation from './src/screens/main';
import config from './tamagui.config';
import { useLayoutData } from '$hooks';
import { ConfirmDialog, useConfirmStore } from '$components';
import { loadAllFillerSounds } from './src/assets/sounds/fillers';
import { AUDIO_CHARACTERISTICS } from './src/services/stores/ble/ble.store';

function Root(): JSX.Element {
  const { status, subscribe } = useUserStore();
  const colorScheme = useColorScheme();
  const { isFetched, data } = useLayoutData();
  const confirmStore = useConfirmStore();

  useEffect(() => {
    // Disables Recaptcha flow but only allows using predefined phone numbers
    // auth().settings.appVerificationDisabledForTesting = __DEV__;
  }, []);

  useEffect(() => {
    return subscribe();
  }, [subscribe]);

  useEffect(() => {
    if (status === 'unverified' || isFetched) {
      SplashScreen.hide();
    }
  }, [status, isFetched]);

  useEffect(() => {
    loadAllFillerSounds(AUDIO_CHARACTERISTICS.SERVER_FORMAT);
  }, []);

  return (
    <TamaguiProvider config={config} defaultTheme={data.preferences?.['2xl:colorScheme'] ?? colorScheme ?? 'light'}>
      <ConfirmDialog isOpen={confirmStore.isOpen} {...confirmStore.props} />
      <MainStackNavigation />
    </TamaguiProvider>
  );
}

export default Root;
