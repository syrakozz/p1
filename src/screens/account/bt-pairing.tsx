import { AppHeader, MainContainer } from '$layout';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Text, View, Image, YStack, XStack, SizableText } from 'tamagui';
import { Button } from '$components';
import { useBleStore } from '../../services/stores/ble/ble.store';
import { AlertTriangle, Check } from '@tamagui/lucide-icons';
import { Alert, Linking } from 'react-native';
import { connectDevice } from '../../api/vox.api';
import { useActiveProfileStore } from '../../services/stores/profile.store';
import Config from 'react-native-config';
import HelpDialog from '../help/help-dialog';

function Footer() {
  const { t } = useTranslation();
  const { isScanning, isConnecting, peripheral, error, startScan, disconnect } = useBleStore();

  if (isScanning || isConnecting) {
    return (
      <Button theme="primary" fontWeight="600" size="$7" disabled>
        {t('profile.please-wait')}
      </Button>
    );
  } else if (error && ['DEVICE_NOT_FOUND_ERROR', 'CONNECTING_ERROR', 'DEVICE_DISCONNECTED_ERROR'].includes(error)) {
    return (
      <Button theme="primary" fontWeight="600" size="$7" onPress={startScan}>
        {t('pairing.scan-again')}
      </Button>
    );
  } else if (error === 'PERMISSIONS_ERROR') {
    return (
      <Button theme="primary" fontWeight="600" size="$7" onPress={() => Linking.openSettings()}>
        {t('pairing.grant-permission')}
      </Button>
    );
  } else if (error === 'BLUETOOTH_OFF_ERROR') {
    return <></>;
  } else if (peripheral) {
    return (
      <Button theme="error" fontWeight="600" size="$7" onPress={() => disconnect()}>
        {t('pairing.disconnect')}
      </Button>
    );
  }
}

const errorMessagesMap = {
  DEVICE_NOT_FOUND_ERROR: 'pairing.2xl-not-found',
  CONNECTING_ERROR: 'pairing.couldnt-connect',
  PERMISSIONS_ERROR: 'pairing.permission-denied',
  BLUETOOTH_OFF_ERROR: 'pairing.enable-bluetooth',
  DEVICE_DISCONNECTED_ERROR: 'pairing.not-connected',
} as const;

function Content() {
  const { t } = useTranslation();
  const { isScanning, isConnecting, peripheral, error } = useBleStore();

  if (error) {
    return (
      <YStack space="$2" alignItems="center">
        <View theme="warning">
          <AlertTriangle top="$-12" size="$12" color="$color1" />
        </View>
        <Text top="$-12" fontSize="$8" color="$color1"> {t(errorMessagesMap[error])}</Text>

        {Config.PUBLIC_WHITELABEL === '2xl' && (
          <Image width="200%" height="100%" top="$-12" resizeMode="contain" source={require('../../assets/images/2xl-disconnected.png')} />
        )}
      </YStack>
    );
  } else if (isScanning || isConnecting) {
    return (
      <YStack space="$2" alignItems="center">
        <Spinner size="large" />
        <Text fontSize="$5">{t('pairing.scanning')}</Text>
      </YStack>
    );
  } else if (peripheral) {
    return (
      <YStack space="$2" alignItems="center" >
        <View theme="success">
          <Check  top="$-12" size="$12" color="$color10"></Check>
          <Text top="$-12" fontSize="$8" color="$color10"> {t('pairing.connected')}</Text>
        </View>
        
        {Config.PUBLIC_WHITELABEL === '2xl' && (
          <Image width="280%" height="100%" top="$-12" resizeMode="contain" source={require('../../assets/images/2xl.png')} />
        )}

        
      </YStack>
    );
  }
}

export default function BtPairingScreen(): JSX.Element {
  const { t } = useTranslation();
  const init = useBleStore(state => state.init);
  const macAddress = useBleStore(state => state.macAddress);
  const { activeProfile } = useActiveProfileStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (macAddress && activeProfile?.selected_character) {
      connectDevice(macAddress, activeProfile?.selected_character).then(response => {
        if (response.first_time) {
          Alert.alert('🎉 Congratulations', `You have been rewarded ${response.first_time_balance_added} vexels!`);
        }
      });
    }
  }, [macAddress, activeProfile?.selected_character]);

  return (
    <MainContainer header={<AppHeader title={t('pairing.connect-with-2xl')} canGoBack />} footer={<Footer />}  
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.connect'}/>,
    }}>
      <YStack space="$3" mt="$4" mx="auto" flex={1} justifyContent="center">
        {Config.PUBLIC_WHITELABEL === '2xl' && (
          <Image w="70%" h="60%" top="$16" resizeMode="contain" source={require('../../assets/images/2xl-welcome.png')} />
        )}
        <Content />
      </YStack>
    </MainContainer>
  );
}
