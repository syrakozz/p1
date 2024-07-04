import React, { FunctionComponent } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import { ListItem, Separator, Text, YGroup, YStack } from 'tamagui';
import { useUserStore } from '../../services/stores/user.store';
import { AppHeader, MainContainer } from '$layout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccountStackParamList } from './account.navigator';
import { Ban, ChevronRight, LogOut, Info, Languages, SunMoon, UserCircle, Lock } from '@tamagui/lucide-icons';
import { useQueryAccount } from '$hooks';
import { deleteMyAccount } from '../../api/vox.api';
import HelpDialog from '../help/help-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AccountStackParamList, 'AccountOverview'>;
type ListItemIconProps = { color?: string; size?: number };
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;

export default function AccountOverviewScreen(): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const { user } = useUserStore();
  const account = useQueryAccount();
  const { auth } = useUserStore();

  const onDeleteAccount = () =>
    Alert.alert('Delete your account?', 'All data related to your account will be permanently deleted.', [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: async () => {
          await deleteMyAccount();
          onSignOut();
        },
      },
    ]);

  function onSignOut() {
    AsyncStorage.multiRemove(["help.alerts", "help.history", "help.profile", "help.account", "help.home", "help.connect", "help.talkmode", "help.youraccount", "help.yourprofile", "help.interests", "help.moderation-recipient", "help.moderation-word", "help.moderation", "help.moderation-topic", "help.customizations", "help.modes"]);
    auth.then(a => a.signOut());
  }

  return (
    <MainContainer header={<AppHeader title={t('account.account')} showBalance={true} />}
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.youraccount'}/>,
    }}
    >
      <YStack space="$5" pb="$3">
        <YStack>
          <YGroup separator={<Separator />}>
            {user?.email && (
              <AccountOverviewItem
                icon={UserCircle}
                title={t('account.account-details')}
                value={user.email}
                onPress={() => nav.navigate('AccountDetails', {})}
              />
            )}
          </YGroup>
        </YStack>

        <YStack>
          <YGroup separator={<Separator />}>
            {/* {Config.PUBLIC_WHITELABEL === '2xl' && (
              <AccountOverviewItem icon={Cast} title={t('pairing.pairing')} onPress={() => nav.navigate('BtPairing', {})} />
            )} */}
            {Config.PUBLIC_WHITELABEL === '2xl' && (
              <AccountOverviewItem icon={Info} title={t('status.status')} onPress={() => nav.navigate('Status', {})} />
            )}
          </YGroup>
        </YStack>

        <YStack>
          <YGroup separator={<Separator />}>
            <AccountOverviewItem icon={Languages} title={t('account.language')} onPress={() => nav.navigate('LanguageSelect', {})} />
            <AccountOverviewItem icon={SunMoon} title={t('color-scheme.appearance')} onPress={() => nav.navigate('ColorScheme', {})} />
          </YGroup>
        </YStack>

        {account.data?.developer_mode && Config.PUBLIC_WHITELABEL === '2xl' && (
          <YStack>
            <Text fontSize="$5" fontWeight="600" ml="$5">
              Developer options
            </Text>
            <YGroup separator={<Separator />}>
              <AccountOverviewItem title="Emotions" onPress={() => nav.navigate('Emotions', {})} />
            </YGroup>
          </YStack>
        )}

        <YStack>
          <YGroup separator={<Separator />}>
            <AccountOverviewItem
              title={<Text color="$red10">{t('account.pin-protection')}</Text>}
              color="$red10"
              icon={Lock}
              iconAfter={null}
              onPress={() => nav.navigate('PinOverview', {})}
            />
            <AccountOverviewItem
              title={<Text color="$red10">{t('common.logout')}</Text>}
              color="$red10"
              icon={LogOut}
              iconAfter={null}
              onPress={onSignOut}
            />
            <AccountOverviewItem
              title={<Text color="$red10">{t('common.delete')}</Text>}
              color="$red10"
              icon={Ban}
              iconAfter={null}
              onPress={onDeleteAccount}
            />
          </YGroup>
        </YStack>
      </YStack>
    </MainContainer>
  );
}

function AccountOverviewItem({
  title,
  value,
  icon,
  iconAfter,
  onPress,
  color,
}: {
  title: string | JSX.Element;
  value?: string;
  icon?: IconProp | null;
  iconAfter?: JSX.Element | null;
  onPress?: () => void;
  color?: string;
}) {
  return (
    <>
      <YGroup.Item>
        <ListItem
          size="$5"
          color={color}
          title={title}
          icon={icon}
          iconAfter={iconAfter === null ? null : onPress ? ChevronRight : value ? <Text>{value}</Text> : iconAfter}
          pressTheme={!!onPress}
          onPress={onPress}
        />
      </YGroup.Item>
    </>
  );
}
