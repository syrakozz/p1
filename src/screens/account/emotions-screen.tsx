import React from 'react';
import { Text, XStack } from 'tamagui';
import { AppHeader, MainContainer } from '$layout';
import { useBleStore } from '../../services/stores/ble/ble.store';
import { Button } from '$components';

export default function EmotionsScreen(): JSX.Element {
  const { displayEmotionId } = useBleStore();

  return (
    <MainContainer header={<AppHeader title="Emotions" canGoBack  showBalance={true}  />}>
      <XStack mx="auto" flexWrap="wrap">
        {[...Array(255).keys()].map(i => (
          <Button theme="subtle" m="$1" circular size="$2" key={i} onPress={() => displayEmotionId(i + 1)}>
            <Text>{i + 1}</Text>
          </Button>
        ))}
      </XStack>
    </MainContainer>
  );
}
