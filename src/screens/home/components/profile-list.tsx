import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Plus, User } from '@tamagui/lucide-icons';
import { View, Text, XStack, Card } from 'tamagui';
import { Profile } from '../../../api/vox.types';

export type ProfileListProps = {
  profiles?: Profile[];
  activeProfile?: Profile | null;
  onItemPress: (profile: Profile) => void;
  onCreate: () => void;
};

export default function ProfileList({ activeProfile, profiles, onItemPress, onCreate }: ProfileListProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <XStack flexWrap="wrap" w="100%">
      {profiles?.map(profile => {
        const isActive = activeProfile?.id === profile.id;

        return (
          <View width="50%" p="$2" key={`option-${profile.id}`}>
            <Card
              size="$4"
              bordered
              width="100%"
              aspectRatio="1/1"
              pressTheme
              theme={isActive ? 'active' : null}
              {...(isActive && {
                borderWidth: 4,
                borderColor: '$blue10',
              })}
              onPress={() => onItemPress(profile)}>
              <Card.Header pos="relative">
                {isActive && (
                  <View pos="absolute" right="$3.5" top="$3.5" theme="info">
                    <CheckCircle2 color="$color10" />
                  </View>
                )}
              </Card.Header>
              <Card.Footer padded justifyContent="center">
                <Text mt="$2" textAlign="center" fontSize="$5" fontWeight="bold" color={isActive ? '$blue10' : undefined}>
                  {profile.name}
                </Text>
              </Card.Footer>
              <Card.Background alignItems="center" justifyContent="center">
                <User size="4" color={isActive ? '$blue10' : undefined} />
              </Card.Background>
            </Card>
          </View>
        );
      })}
      <View width="50%" p="$2">
        <Card size="$4" bordered width="100%" aspectRatio="1/1" pressTheme onPress={onCreate}>
          <Card.Footer padded justifyContent="center">
            <Text mt="$2" textAlign="center" fontSize="$5" fontWeight="bold">
              {t('profile.add-new')}
            </Text>
          </Card.Footer>
          <Card.Background alignItems="center" justifyContent="center">
            <Plus size="4" />
          </Card.Background>
        </Card>
      </View>
    </XStack>
  );
}
