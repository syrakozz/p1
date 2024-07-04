import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, YoutubeVideoPlayer } from '$components';
import { Header, MainContainer } from '$layout';
import { Circle, H2, H3, H4, Heading, Input, Paragraph, SizableText, Text, View, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HelpBase from './components/help-base'
import { MainStackParamList } from '../main.navigator';
import { ChevronLeft } from '@tamagui/lucide-icons';


type Props = NativeStackScreenProps<MainStackParamList, 'HelpScreen'>;

export default function HelpWrapper(props: any): JSX.Element {
    const nav = useNavigation<Props['navigation']>();
    const { t } = useTranslation();
    const pageName = props.route?.params?.helpId || "help.new-account"
    const [show, setShow] = useState(true);
    const [autoPlay, setAutoplay] = useState(true);
    const onButtonPress = () => {
        setShow(false);
        if (props?.route?.params?.nextScreen) {
            setAutoplay(false);
            nav.pop();
            nav.navigate(props.route.params.nextScreen, {});
        }
    };

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', async () => {
            setShow(true);
        });
        return unsubscribe;
    }, [nav]);

    useEffect(() => {
        const unsubscribe = nav.addListener('blur', () => {
            setShow(false);
        });
        return unsubscribe;
    }, [nav]);
    ``

    if (show) {
        return (
            <HelpBase id="" header={t(`${pageName}.header`)} title={t(`${pageName}.title`)} message={t(`${pageName}.message`)} button={t(`${pageName}.button`)} videoLink={t(`${pageName}.videolink`)} onButtonPress={onButtonPress}/>
        );
    }
    return <></>;
}
