import React from 'react';
import { BatteryLow, BatteryMedium, BatteryFull, Check, ChevronRight } from '@tamagui/lucide-icons';
import { ButtonProps, Circle, Image, Text, View, XStack } from 'tamagui';
import { Button } from '$components';
import { t } from 'i18next';

export type ConnectionStepProps = ButtonProps & {
  connected: boolean;
  isScanning: boolean;
  isConnecting: boolean;
  batteryLevel: number | undefined;
};

export default function ConnectionStep({ connected, disabled, isScanning, isConnecting, batteryLevel, ...rest }: ConnectionStepProps) {
  return (
    <View theme={connected ? 'subtle' : 'primary'}>
      <Button
        disabled={disabled}
        fontWeight="500"
        fontSize="$7"
        pressTheme
        size="$7"
        px="$2"
        elevation={1}
        bordered
        borderWidth={6}
        alignItems="center"
        justifyContent="flex-start"
        icon={
          <Circle size="$3.5" theme="inverse">
            <Image w="100%" h="100%" resizeMode="contain" source={require('../../../assets/images/2xl.png')} />
          </Circle>
        }
        iconAfter={
          <View ml="auto">
            {connected ? (
              <>
                {batteryLevel ? (
                  <XStack alignItems="center">
                    <Text fontSize="$1" mr="$1">
                      {batteryLevel}%
                    </Text>
                    {batteryLevel < 20 ? <BatteryLow /> : batteryLevel < 40 ? <BatteryMedium /> : <BatteryFull />}
                  </XStack>
                ) : (
                  <View theme="success">
                    <Check size="$2" color="$color10" />
                  </View>
                )}
              </>
            ) : (
              <ChevronRight />
            )}
          </View>
        }
        {...rest}>
        {connected ? t('pairing.connected') : isScanning || isConnecting ? t('profile.please-wait') : t('pairing.connect-with-2xl')}
      </Button>
    </View>
  );
}
