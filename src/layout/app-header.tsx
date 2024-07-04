import React from 'react';
import { Button } from '$components';
import Header, { HeaderProps } from './header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Text, Unspaced } from 'tamagui';
import { useUserStore } from '../services/stores/user.store';
import { formatCash } from '../services/utils/various.utils';
import { Coins } from '@tamagui/lucide-icons';

export type AppHeaderProps = HeaderProps;

type Props = NativeStackScreenProps<{ Balance: {} }>;

export default function AppHeader({ rightAction, showBalance =false, ...rest }: AppHeaderProps) {
  const nav = useNavigation<Props['navigation']>();
  const balance = useUserStore(state => state.balance);

  function onBalance() {
    nav.navigate('Balance', {});
  }

  return (
    <Header
      rightAction={
        rightAction ? rightAction : 
        showBalance && (
          <Button size="$2" minWidth="$7" overflow="visible" pl="$4" pr="$2" backgroundColor="$blackA10Dark" onPress={onBalance}>
            <Unspaced>
              <Coins size="$2" color="$color.yellow10Light" position="absolute" left="$-3" />
            </Unspaced>
            <Text fontSize="$2" color="$color.whiteA12Light">
              {typeof balance === 'number' && balance >= 0 ? formatCash(balance) : '-'}
            </Text>
          </Button>
        )
      }
      {...rest}
    />
  );
}
