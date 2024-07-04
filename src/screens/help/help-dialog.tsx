import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView as RNScrollView } from 'react-native';
import { ChevronLeft, HelpCircle } from '@tamagui/lucide-icons';
import { Image, ScrollView, SizableText, View, YStack } from 'tamagui';
import { Dialog as TGDialog, XStack } from 'tamagui';
import Config from 'react-native-config';
import YoutubeVideoPlayer from '../../components/youtube-video-player';
import Button from '../../components/button/button';
import HelpBase from './components/help-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
type HelpDialogProps = {
  isAuto?: boolean
  helpId: string
  triggerChild?: React.ReactNode
};

export default function HelpDialog({ helpId: helpId, triggerChild , isAuto = false}: HelpDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [autoPlay, setAutoplay] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    if (isAuto) {
      checkExists()
    }
  }, [])

  async function checkExists() {
    var item = await AsyncStorage.getItem(helpId)
    if (item == null) {
      AsyncStorage.setItem(helpId, "done")
      setIsOpen(true);
      setAutoplay(true)
      setIsFirstTime(true)
    }
  }

  function closeHelp() {
    setIsOpen(false);
    setAutoplay(false);
    setIsFirstTime(false);
  }
  
  helpId = helpId || 'help.home';
  return (
    <TGDialog modal open={isOpen} onOpenChange={setIsOpen}>
      <TGDialog.Trigger asChild>{triggerChild
        || <Button  borderRadius={50} width={45} chromeless icon={<HelpCircle color={'#fff'} size={50} />} />
      }</TGDialog.Trigger>

      <TGDialog.Portal>

        <TGDialog.Content w="110%" paddingTop={20} bordered elevate key="content" gap="$4" size="$3.5">
          <HelpBase
            id=""
            header={t(`${helpId}.header`)}
            title={t(`${helpId}.title`)}
            message={t(`${helpId}.message`)}
            button={isFirstTime ? t(`${helpId}.button`) : undefined}
            videoLink={t(`${helpId}.videolink`)}
            onButtonPress={closeHelp}
            topLeftAction={ !isFirstTime && <Button theme="subtle" size="$3" circular icon={<ChevronLeft size="$1.5" />} onPress={closeHelp} />}
            autoPlay={autoPlay}
          />
        </TGDialog.Content>
      </TGDialog.Portal>
    </TGDialog>

  );
}