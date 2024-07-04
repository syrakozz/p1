import React, { useEffect, useMemo } from 'react';
import AccountScreen from '../account/account';
import { CalendarDays, Bell, Users2, Settings, Lock, AlertTriangle, HelpCircle, HelpingHand, BadgeHelp } from '@tamagui/lucide-icons';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Circle, Text, XStack, YStack, useTheme } from 'tamagui';
import { IconProps } from '@tamagui/helpers-icon';
import HistoryScreen from '../history/history';
import { MainTab } from './main.navigator';
import HomeScreen from '../home/home';
import NotificationsScreen from '../notifications/notifications';
import { useChatStore } from '../../services/stores/chat';
import { useHistoryStore } from '../../services/stores/history.store';
import { useConnectionStore } from '../../services/stores/connection.store';
import { useUserStore } from '../../services/stores/user.store';
import { useActiveProfileStore } from '../../services/stores/profile.store';
import { useQueryPreferences } from '../../hooks/preferences';
import { useQueryProfiles } from '../../hooks/profile';
import { t } from 'i18next';
import { useNavigation } from '@react-navigation/native';
import { useLockScreen } from '../../components/lock-screen';
import { useQueryAccount } from '../../hooks/account';
import { Button } from '$components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../main.navigator';
import HelpHome from '../help/help-home';

const TabBarIcon =
  ({ Icon, badge, label }: { Icon: React.NamedExoticComponent<IconProps>; badge?: React.ReactNode; label: string }) =>
  (props: Parameters<NonNullable<BottomTabNavigationOptions['tabBarIcon']>>[0]) => {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <XStack pos="relative">
          <Icon {...props} />
          {badge}
        </XStack>
        <Text fontSize="$2" fontWeight="600" color={props.color} whiteSpace="nowrap" ellipse>
          {label}
        </Text>
      </YStack>
    );
  };

type NavProps = NativeStackScreenProps<MainStackParamList, 'Main'>;

export default function Main(): JSX.Element {
  const theme = useTheme();
  const primaryTheme = useTheme({ name: 'primary' });
  const { reset } = useChatStore(state => ({ reset: state.reset }));
  const notifications = useUserStore(state => state.notifications);
  const hasUnreadNotification = useMemo(() => notifications.some(({ read }) => !read), [notifications]);
  const preferences = useQueryPreferences();
  const account = useQueryAccount();
  const profiles = useQueryProfiles();
  const { setActiveProfile, setIsFetching } = useActiveProfileStore();
  const navigation = useNavigation<NavProps['navigation']>();
  const navigationState = navigation.getState();
  const { isAuthorized, isAuthorizedUntil, checkIfRequiresUnlock, setPin, setLock, pin } = useLockScreen();
  const activeRoute = useMemo(() => {
    let currentRoute = navigationState.routes[navigationState.index];
    while (currentRoute.state) {
      if (typeof currentRoute.state.index === 'number') {
        currentRoute = currentRoute.state.routes[currentRoute.state.index];
      }
    }

    return currentRoute;
  }, [navigationState]);

  useEffect(() => {
    setPin(account.data?.pin);
  }, [account.data?.pin, setPin]);

  useEffect(() => {
    checkIfRequiresUnlock(activeRoute);
  }, [checkIfRequiresUnlock, activeRoute]);

  useEffect(() => {
    return () => {
      // reset all zustand stores
      useChatStore.getState().reset();
      useHistoryStore.getState().reset();
      useConnectionStore.getState().reset();
      useActiveProfileStore.getState().reset();
    };
  }, []);

  useEffect(() => {
    setIsFetching(profiles.isFetching || preferences.isFetching);
    if (profiles.data && preferences.data) {
      setActiveProfile(profiles.data, preferences.data);
    }
  }, [setIsFetching, setActiveProfile, profiles, preferences]);

  useEffect(() => {
    return reset;
  }, [reset]);

  function onSetLock() {
    setLock();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  }

  return (
    <>
      {pin && (isAuthorized || Date.now() < isAuthorizedUntil) && (
        <XStack h="$4" theme="error" bg="$color12" justifyContent="center" space="$2" alignItems="center">
          <AlertTriangle size="$2.5" color="$color8" />
          <Text fontSize="$2" maxWidth={'45%'} fontWeight="600" color="$color8" textAlign="left">
            {t('account.unlock-warning')}
          </Text>
          <Button alignSelf="center" size="$2" color="$color.whiteA12Light" icon={Lock} onPress={onSetLock}>
            {t('account.lock')}
          </Button>
        </XStack>
      )}
      <MainTab.Navigator
        screenOptions={{
          unmountOnBlur: true,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: primaryTheme.color10.val,
          tabBarInactiveTintColor: theme.color10.val,
          tabBarIconStyle: {
            width: '100%',
          },
          tabBarStyle: {
            borderTopWidth: 2,
            height: 60,
            borderTopColor: theme.borderColor.val,
            backgroundColor: theme.background.val,
          },
        }}>
        <MainTab.Screen
          options={{ tabBarIcon: TabBarIcon({ Icon: Users2, label: t('profile.home') }) }}
          name="Home"
          component={HomeScreen}
        />
        <MainTab.Screen
          options={{ tabBarIcon: TabBarIcon({ Icon: CalendarDays, label: t('history.history') }) }}
          name="History"
          component={HistoryScreen}
        />
        <MainTab.Screen
          options={{
            tabBarIcon: props =>
              TabBarIcon({
                Icon: Bell,
                badge: !props.focused && hasUnreadNotification && (
                  <Circle pos="absolute" right="$0" top="$-1" size={10} theme="error" bg="$color8" />
                ),
                label: t('notifications.notifications'),
              })(props),
          }}
          name="Notifications"
          component={NotificationsScreen}
        />
        <MainTab.Screen
          options={{
            tabBarIcon: TabBarIcon({
              Icon: Settings,
              label: t('account.account'),
            }),
          }}
          name="Account"
          component={AccountScreen}
        />
      </MainTab.Navigator>
    </>
  );
}
