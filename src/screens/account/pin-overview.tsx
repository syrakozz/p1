import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader, MainContainer } from '$layout';
import { useLockScreen } from '../../components/lock-screen';
import { YStack, ListItem, YGroup, Text, Separator } from 'tamagui';
import { ChevronRight, Star, Trash } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamList } from './account.navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useConfirm } from '../../components/confirm';
import { useMutateAccount } from '../../hooks/account';

type Props = NativeStackScreenProps<AccountStackParamList, 'PinOverview'>;

export default function PinOverviewScreen(): JSX.Element {
  const { t } = useTranslation();
  const { pin } = useLockScreen();
  const nav = useNavigation<Props['navigation']>();
  const confirm = useConfirm();
  const { mutateAsync } = useMutateAccount();

  async function onDelete() {
    confirm({
      callback: async () => {
        await mutateAsync({ pin: '' });
      },
    });
  }

  return (
    <MainContainer header={<AppHeader title={t('account.pin-protection')} canGoBack  showBalance={true}  />}>
      <YStack flex={1} space="$3.5">
        <YGroup separator={<Separator />}>
          <YGroup.Item>
            <ListItem
              size="$5"
              title={t('account.edit-pin')}
              icon={Star}
              iconAfter={ChevronRight}
              pressTheme
              onPress={() => nav.navigate('ChangePin', {})}
            />
          </YGroup.Item>
          {pin && (
            <YGroup.Item>
              <ListItem
                size="$5"
                color="$red10"
                title={<Text color="$red10">{t('account.delete-pin')}</Text>}
                icon={Trash}
                iconAfter={ChevronRight}
                pressTheme
                onPress={onDelete}
              />
            </YGroup.Item>
          )}
        </YGroup>
      </YStack>
    </MainContainer>
  );
}
