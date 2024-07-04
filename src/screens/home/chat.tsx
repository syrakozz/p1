import React from 'react';
import { AppHeader, MainContainer } from '$layout';
import { YStack, XStack, SizableText, Image } from 'tamagui';
import { Mic, Pause } from '@tamagui/lucide-icons';
import { useQueryPreferences } from '$hooks';
import { useTranslation } from 'react-i18next';
import { Button } from '$components';
import { useChatStore } from '../../services/stores/chat';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const preferences = useQueryPreferences();
  const { reset, messages, isRecording, isLoading, isTalking, startRecording, stopRecording } = useChatStore();

  return (
    <MainContainer
      autoScrollToEnd
      onRefresh={reset}
      header={<AppHeader title={t('testing.chat')} canGoBack />}
      footer={
        <Button
          mx="auto"
          theme="primary"
          size="$5"
          icon={isRecording ? <Pause size="$3" /> : <Mic size="$3" />}
          circular
          loading={isLoading}
          {...(preferences.data?.['2xl:talkingMode'] === 'press'
            ? { onPress: () => (isRecording ? stopRecording() : startRecording(true)) }
            : { onPressIn: () => startRecording(true), onPressOut: () => stopRecording() })}
          disabled={isTalking}
        />
      }>
      <YStack space="$2">
        {messages.map((message, index) => {
          return message.role === 'image' ? (
            <Image
              key={index}
              br="$4"
              width="100%"
              aspectRatio="1/1"
              resizeMode="contain"
              source={{ uri: `data:image/png;base64,${message.imageUri}` }}
            />
          ) : (
            <XStack key={index} space="$2" justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}>
              <XStack
                br="$4"
                bg="$color5"
                px="$3"
                py="$2"
                justifyContent="space-between"
                alignItems="center"
                space="$4"
                flexShrink={1}
                theme={message.role === 'user' ? 'subtle' : 'primary'}>
                <SizableText flexShrink={1}>{message.text}</SizableText>
              </XStack>
            </XStack>
          );
        })}
      </YStack>
    </MainContainer>
  );
}
