import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Separator, YStack } from 'tamagui';
import { AppHeader, MainContainer } from '$layout';
import { useQueryProfiles } from '$hooks';
import { HomeStackParamList } from './home.navigator';
import ProfileList from './components/profile-list';
import { Profile } from '../../api/vox.types';
import { useBleStore } from '../../services/stores/ble/ble.store';
import ChatButton from './components/chat-button';
import Config from 'react-native-config';
import { useActiveProfileStore } from '../../services/stores/profile.store';
import ConnectionStep from './components/connection-step';
import { MainStackParamList } from '../main.navigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../main/main.navigator';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';
import { HelpCircle } from '@tamagui/lucide-icons';

type Props = CompositeScreenProps<
NativeStackScreenProps<HomeStackParamList, 'HomeOverview'>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<MainStackParamList>
  >
>

export default function HomeOverviewScreen(): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const { data, isFetching } = useQueryProfiles();
  const { activeProfile } = useActiveProfileStore();
  const { peripheral, isScanning, isConnecting, batteryLevel, startScan, init } = useBleStore();
  

  useEffect(() => {
    console.log("home is useEffect called");
    init();
    setInterval(async () => {
      
      //Log connection every xxxx milliseconds
      console.log(`checkBleConnectionInBackground ${peripheral}`);

      // if auto scanning is not working 
      // if(!peripheral){
      //   console.log('scanning');
      // if(!isScanning){
        startScan()
      // }
      // }
    },5000)
  }, [])
  

  function onCreate() {
    // CreateNewProfileAssist
    nav.navigate('ProfilePersonalDetails', {});
  }

  function onItemPress(profile: Profile) {
    nav.navigate('ProfileOverview', { profileId: profile.id });
  }

  function onConnect() {
    nav.navigate('BtPairing', {});
  }

  return (
    <MainContainer header={<AppHeader title={t('profile.profiles')} />}
      isFetching={isFetching}
      footer={<ChatButton />}
      fab={{
        icon: <HelpDialog
         isAuto={true}
         helpId={'help.home'}/>,
      }}
    >
      <YStack space="$7" mb="$4" w="100%" maxWidth={550} flex={1} alignSelf="center">
        <YStack space="$3" width="100%">
          <ProfileList profiles={data} activeProfile={activeProfile} onItemPress={onItemPress} onCreate={onCreate} />
        </YStack>

        {Config.PUBLIC_WHITELABEL === '2xl' && activeProfile && (
          <YStack>
            <Separator mb="$7" />
            <ConnectionStep
              connected={!!peripheral}
              isScanning={isScanning}
              isConnecting={isConnecting}
              batteryLevel={batteryLevel}
              onPress={onConnect}
              disabled={!activeProfile}
            />
          </YStack>
        )}
      </YStack>
    </MainContainer>
  );
}
