import React, { ReactNode, useRef, useState } from 'react';
import { ScrollView as RNScrollView, RefreshControl } from 'react-native';
import { Circle, Image, Paragraph, ScrollView, Spinner, Text, View, YStack } from 'tamagui';
import Config from 'react-native-config';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { BadgeHelp, HelpCircle, WifiOff } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { useConnectionStore } from '../services/stores/connection.store';
import Logo from './logo';

export type IFab = {
  icon?: ReactNode;
  onPress?: () => void;
}

type MainContainerProps = {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  isFetching?: boolean;
  autoScrollToEnd?: boolean;
  fab?: IFab;
  onRefresh?: () => void | Promise<void>;
  fullWidth?: boolean;
};

function MainContent({ children, autoScrollToEnd = false, fullWidth = false, onRefresh }: MainContainerProps) {
  const scrollRef = useRef<RNScrollView | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <YStack
      flex={1}
      flexGrow={1}
      theme="neutral"
      themeShallow
      bg={!fullWidth ? '$color9' : null}
      mt={!fullWidth ? '3.5%' : '$0'}
      mx={!fullWidth ? '$2.5' : '$0'}
      borderTopStartRadius={16}
      borderTopEndRadius={16}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={() => autoScrollToEnd && scrollRef.current?.scrollToEnd({ animated: false })}
        refreshControl={onRefresh && <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <YStack
          pt={!fullWidth ? '7%' : '$0'}
          px={!fullWidth ? '$4' : '$0'}
          flex={1}
          justifyContent="space-between"
          maxWidth={672}
          w="100%"
          mx="auto">
          {children}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

export default function MainContainer(props: MainContainerProps): JSX.Element {
  const { children, header, footer, fab, isFetching = false, ...rest } = props;
  const { isConnected, type } = useConnectionStore();
  const { t } = useTranslation();

  return (
    <YStack pt="$2.5" mx="auto" width="100%" height="100%">
      {Config.PUBLIC_WHITELABEL === '2xl' && (
        <Image position="absolute" w="100%" h="120%" resizeMode="cover" source={require('../assets/images/bg.png')} />
      )}
      {isConnected || type === NetInfoStateType.unknown ? (
        <>
          {header}
          <MainContent {...rest}>
            <YStack flex={1} pb={footer ? '$0' : '$5'}>
              {isFetching ? (
                <YStack pt="$6" px="$3" space="$2" alignItems="center">
                  <Spinner size="large" color="$orange10" />
                  <Text fontSize="$4">{t('main.loading')}</Text>
                </YStack>
              ) : (
                children
              )}
            </YStack>
            {footer && <View py="$5">{footer}</View>}


          </MainContent>
        </>
      ) : (
        <YStack flex={1}>
          <Logo alignSelf="center" />
          <YStack flex={1} space="$4" alignItems="center" justifyContent="center" px="$3.5">
            <WifiOff size="$10" />
            <Paragraph fontSize="$6" textAlign="center">
              {t('main.no-internet-connection')}
            </Paragraph>
            <Paragraph fontSize="$4" textAlign="center" color="$color11">
              {t('main.please-connect-phone')}
            </Paragraph>
          </YStack>
        </YStack>
      )}
     { fab && <Circle style={{
        backgroundColor: '#ff6e40',
        position: 'absolute',
        borderColor: '#00ff00',
        borderWidth: 1,
        bottom: 10,
        right: 20,
      }}
        size="$4"
        onPress={fab?.onPress}
      >
        {fab?.icon || <HelpCircle color={'#fff'} size={50} />}
      </Circle>}
    </YStack>
  );
}
