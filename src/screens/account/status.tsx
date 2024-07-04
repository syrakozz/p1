import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, YStack } from 'tamagui';
import { ProgressBar } from '$components';
import { AppHeader, MainContainer } from '$layout';
import { useBleStore } from '../../services/stores/ble/ble.store';
import { getVersion } from 'react-native-device-info';

// TODO https://www.npmjs.com/package/react-native-check-version
const versionNumber = getVersion();

export default function StatusScreen(): JSX.Element {
  const { t } = useTranslation();
  const { batteryLevel, firmwareVersion, macAddress, peripheral } = useBleStore();

  return (
    <MainContainer header={<AppHeader title={t('status.status')} canGoBack showBalance={true} />}>
      <YStack space="$6">
        <View>
          <Text fontSize="$4" fontWeight="600" mb="$2">
            {t('status.battery-level')}
          </Text>
          {peripheral && batteryLevel ? (
            <ProgressBar percentage={batteryLevel} theme={batteryLevel < 20 ? 'error' : batteryLevel < 40 ? 'warning' : 'success'} />
          ) : (
            <View height="$4.5" borderRadius="$4" justifyContent="center" bg="$background" theme={'subtle'}>
              <Text textAlign="center">{!peripheral ? t('status.disconnected') : t('profile.please-wait')}</Text>
            </View>
          )}
        </View>
        <View>
          <Text fontSize="$4" fontWeight="600" mb="$2">
            {t('status.connectivity-status')}
          </Text>

          <View height="$4.5" borderRadius="$4" justifyContent="center" bg="$background" theme={'subtle'}>
            <Text textAlign="center">{peripheral ? t('status.connected') : t('status.disconnected')}</Text>
            {macAddress && (
              <Text textAlign="center" fontSize="$3" mt="$0.5">
                2XL ID: {macAddress.replace(/(\w{4})(?=\w)/g, '$1-')}
              </Text>
            )}
          </View>
        </View>
        <View>
          <Text fontSize="$4" fontWeight="600" mb="$2">
            {t('status.version')}
          </Text>
          <View height="$4.5" w="100%" borderRadius="$4" flex={1} justifyContent="center" bg="$background" theme="subtle">
            <Text textAlign="center">
              {t('status.version') + ` ${versionNumber}` + (firmwareVersion ? ` (Firmware: ${firmwareVersion})` : '')}
            </Text>
          </View>
        </View>
      </YStack>
    </MainContainer>
  );
}
