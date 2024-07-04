import React from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from '@tamagui/lucide-icons';
import { ListItem, Paragraph, Separator, YGroup, YStack } from 'tamagui';
import { MainContainer, AppHeader } from '$layout';
import { useDeleteProfile, useMutatePreferences, useQueryPreferences, useQueryProfile } from '$hooks';
import { HomeStackParamList } from './home.navigator';
import { Button } from '$components';
import ChatButton from './components/chat-button';
import { useActiveProfileStore } from '../../services/stores/profile.store';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProfileOverview'>;

export default function ProfileOverviewScreen(props: Props): JSX.Element {
  const { route } = props;
  const nav = useNavigation<Props['navigation']>();
  const { t } = useTranslation();
  const profileId = route.params.profileId;
  const { activeProfile } = useActiveProfileStore();
  const profile = useQueryProfile(profileId);
  const preferences = useQueryPreferences();
  const { mutate } = useMutatePreferences();
  const { mutateAsync: deleteProfileAsync } = useDeleteProfile();

  function onActivate() {
    mutate({
      '2xl:activeProfileId': profileId,
    });
  }

  const onDeleteProfile = () =>
    Alert.alert(`Delete ${profile.data?.name || ''}?`, 'By deleting this profile you will not be able to use it anymore.', [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('profile.delete-profile'),
        onPress: async () => {
          await deleteProfileAsync(profile.data!.id);
          nav.navigate('HomeOverview', {});
        },
      },
    ]);

  return (
    <MainContainer
      header={<AppHeader title={profile.data?.name} canGoBack />}
      footer={
        profileId !== activeProfile?.id ? (
          <YStack space>
            <Button theme="primary" fontWeight="600" size="$5" onPress={onActivate}>
              {t('common.activate')}
            </Button>
            <Button theme="error" fontWeight="600" size="$5" onPress={onDeleteProfile}>
              {t('profile.delete-profile')}
            </Button>
          </YStack>
        ) : (
          <ChatButton />
        )
      }
      fab={{
        icon: <HelpDialog
        isAuto={true}
        helpId={'help.yourprofile'}/>,
      }}

      isFetching={profile.isFetching}>
      <YGroup separator={<Separator />}>
        <YGroup.Item>
          <ListItem
            size="$5"
            title={t('profile.personal-details')}
            // this will always be filled with data
            subTitle={[profile.data?.name, profile.data?.response_age].filter(Boolean).join(' • ')}
            iconAfter={ChevronRight}
            pressTheme
            onPress={() => {
              nav.navigate('ProfilePersonalDetails', { profileId });
            }}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            size="$5"
            title={t('profile.interests')}
            subTitle={t('profile.select-interests', { name: profile.data?.name })}
            iconAfter={ChevronRight}
            pressTheme
            onPress={() => {
              nav.navigate('ProfileInterests', { profileId });
            }}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            size="$5"
            title={t('profile.moderation')}
            subTitle={t('profile.setup-moderation')}
            iconAfter={ChevronRight}
            pressTheme
            onPress={() => {
              nav.navigate('ProfileModeration', { profileId });
            }}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            size="$5"
            title={t('profile.customizations')}
            subTitle={t('profile.customize-character')}
            iconAfter={ChevronRight}
            pressTheme
            onPress={() => {
              nav.navigate('ProfileContentCustomizations', { profileId });
            }}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            size="$5"
            title={t('account.talking-mode')}
            subTitle={t(`account.${preferences.data?.['2xl:talkingMode']}`)}
            iconAfter={ChevronRight}
            pressTheme
            onPress={() => {
              nav.navigate('TalkingMode', {});
            }}
          />
        </YGroup.Item>

        {profileId === activeProfile?.id && (
          <YGroup.Item>
            <ListItem
              size="$5"
              title={t('status.status')}
              iconAfter={
                profileId === activeProfile?.id ? (
                  <Paragraph theme="success" color="$color9">
                    {t('common.active')}
                  </Paragraph>
                ) : (
                  <Paragraph color="$color11">{t('common.inactive')}</Paragraph>
                )
              }
            />
          </YGroup.Item>
        )}
      </YGroup>
    </MainContainer>
  );
}
