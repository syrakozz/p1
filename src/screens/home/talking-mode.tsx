import React, { useEffect } from 'react';
import { useMutatePreferences, useQueryPreferences } from '$hooks';
import { MainContainer, AppHeader } from '$layout';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { SUPPORTED_TALKING_MODES, TalkingMode } from '../../api/vox.types';
import { ToggleGroup } from '$components';
import Config from 'react-native-config';
import { useBleStore } from '../../services/stores/ble/ble.store';
import { ListItem, Separator, YGroup } from 'tamagui';
import Switch from '../../components/forms/switch';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

export default function TalkingModeScreen(): JSX.Element {
  const { t } = useTranslation();
  const preferences = useQueryPreferences();
  const { mutateAsync } = useMutatePreferences();
  const { setIsVadEnabled, stopVad } = useBleStore();

  type Values = {
    talkingMode: TalkingMode;
    hasInsightFiller: boolean;
    hasThinkingFiller: boolean;
  };

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    control,
  } = useForm<Values>({
    defaultValues: {
      talkingMode: preferences.data?.['2xl:talkingMode'],
      hasInsightFiller: preferences.data?.['2xl:hasInsightFiller'],
      hasThinkingFiller: preferences.data?.['2xl:hasThinkingFiller'],
    },
  });

  const fields = useWatch({ control, name: ['talkingMode', 'hasInsightFiller', 'hasThinkingFiller'] });

  const onSubmit = async ({ talkingMode, hasInsightFiller, hasThinkingFiller }: Values) => {
    mutateAsync({
      '2xl:talkingMode': talkingMode,
      '2xl:hasInsightFiller': hasInsightFiller,
      '2xl:hasThinkingFiller': hasThinkingFiller,
    });

    reset({ talkingMode, hasInsightFiller, hasThinkingFiller }, { keepValues: true });

    if (talkingMode !== 'auto') {
      setIsVadEnabled(false);
      stopVad();
    }
  };

  // react to mode change from the toy buttons
  useEffect(() => {
    setValue('talkingMode', preferences?.data?.['2xl:talkingMode'] as TalkingMode);
  }, [setValue, preferences.data]);

  useEffect(() => {
    if (isDirty) {
      setTimeout(() => {
        handleSubmit(onSubmit)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, isDirty, handleSubmit]);

  return (
    <MainContainer isFetching={preferences.isFetching} header={<AppHeader title={t('account.talking-mode')} canGoBack />}
    fab={{

      icon: <HelpDialog
      isAuto={true}
      helpId={'help.talkmode'}/>,
    }}
    >
      <ToggleGroup
        type="single"
        orientation="vertical"
        disableDeactivation
        name="talkingMode"
        control={control}
        size="$4"
        items={SUPPORTED_TALKING_MODES.filter(mode => mode !== 'auto' || Config.PUBLIC_WHITELABEL === '2xl').map(mode => ({
          value: mode,
          label: t(`account.${mode}`),
          description: t(`account.${mode}-description`),
        }))}
      />

      {Config.PUBLIC_WHITELABEL === '2xl' && (
        <YGroup mt="$3.5">
          <YGroup.Item>
            <ListItem
              pressTheme
              size="$5"
              title={t('account.insights')}
              subTitle={t('account.insights-description')}
              iconAfter={
                <Switch size="$3.5" name="hasInsightFiller" control={control}>
                  <Switch.Thumb theme="primary" animation="quick" />
                </Switch>
              }
            />
          </YGroup.Item>

          <Separator />

          <YGroup.Item>
            <ListItem
              pressTheme
              size="$5"
              title={t('account.thinking')}
              subTitle={t('account.thinking-description')}
              iconAfter={
                <Switch size="$3.5" name="hasThinkingFiller" control={control}>
                  <Switch.Thumb theme="primary" animation="quick" />
                </Switch>
              }
            />
          </YGroup.Item>
        </YGroup>
      )}
    </MainContainer>
  );
}
