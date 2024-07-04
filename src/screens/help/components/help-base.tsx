import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, YoutubeVideoPlayer } from '$components';
import { Header, MainContainer } from '$layout';
import { Circle, H2, H3, H4, Heading, Image, Input, Paragraph, Portal, ScrollView, SizableText, Text, View, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/home.navigator';
import { Dialog as TGDialog, Unspaced, } from 'tamagui';
import Config from 'react-native-config';
import { ScrollView as RNScrollView } from 'react-native';

type Props = NativeStackScreenProps<HomeStackParamList, 'ConnectRobotAssist'>;

// IHelpBase - interface for HelpBase component
interface IHelpBase {
    id: string;
    header: string;
    title: string;
    message: string;
    button?: string;
    videoLink: string;
    topLeftAction?: React.ReactNode;
    topRightAction?: React.ReactNode;
    onButtonPress?: () => void;
    autoPlay: boolean;
}


export default function HelpBase({
    header,
    title,
    message,
    button,
    videoLink,
    topLeftAction,
    topRightAction,
    onButtonPress,
    autoPlay = true
}: IHelpBase): JSX.Element {
    const scrollRef = useRef<RNScrollView | null>(null);

    return (
        <Portal>
            <YStack mx="auto" width="100%" height="110%" paddingTop={'15%'}>
                <Image position="absolute" w="100%" h="120%" resizeMode="cover" source={require('../../../assets/images/bg.png')} />
      
                    <XStack justifyContent="space-between" px="$2.5" pt="$3" pb="$3" space="$0.25">
                        <View justifyContent="center" alignItems="center"  minWidth="$3.5">
                            {topLeftAction}
                        </View>
                        <View flex={1} justifyContent="center" alignItems="center" theme={Config.PUBLIC_WHITELABEL === '2xl' ? 'dark' : undefined}>
                            {header && (
                                <SizableText textAlign="center" size="$7" fontWeight="bold" >
                                    {header}
                                </SizableText>
                            )}
                        </View>
                        <View justifyContent="center"  minWidth="$3.5">
                            {topRightAction}
                        </View>
                    </XStack>
                    <SizableText textAlign="center" size="$4" theme={Config.PUBLIC_WHITELABEL === '2xl' ? 'dark' : undefined}>
                        {title}
                    </SizableText>
        
                <YStack
                    flex={1}
                    flexGrow={1}
                    theme="neutral"
                    themeShallow
                    bg={'$color9'}
                    marginBottom={'$14'}
                    marginTop={'$3'}
                    mx={'$3'}
                    borderRadius={16}
                >
                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <YStack
                            pt={'7%'}
                            px={'$4'}
                            flex={1}
                            maxWidth={672}
                            w="100%"
                            mx="auto">
                            <YoutubeVideoPlayer videoUrl={videoLink} height={225} autoPlay={autoPlay} />
                            <SizableText size="$6" mt="$4" mb="$5">
                                {message}
                            </SizableText>
                           
                        </YStack>
                    </ScrollView>
                    {button && <Button theme="primary" my={10} mx={10} fontWeight="600" size="$7" onPress={onButtonPress}>
                        {button}
                    </Button>}
                </YStack>
            </YStack>
        </Portal>
    );
}
