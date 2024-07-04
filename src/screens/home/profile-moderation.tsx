import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Paragraph, Text, View, XStack, YStack } from 'tamagui';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { MainContainer, AppHeader } from '$layout';
import { Checkbox, Input } from '$components';
import { useMutateProfile, useQueryProfile } from '$hooks';
import {
  DEFAULT_MODERATION_CATEGORIES,
  DEFAULT_TEXT_ANALYSIS_CATEGORIES,
  ModeratonCategory,
  TextAnalysisCategory,
} from '../../api/vox.types';
import { HomeStackParamList } from './home.navigator';
import EmailSectionDialog from './components/email-section-dialog';
import Section from './components/section';
import WordsSectionDialog from './components/words-section-dialog';
import TopicsSectionDialog from './components/topics-section-dialog';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProfileModeration'>;

export default function ProfileModerationScreen({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const profileId = route.params.profileId;
  const profile = useQueryProfile(profileId);
  const { mutateAsync } = useMutateProfile(profileId);

  type Values = {
    moderations: { id: ModeratonCategory; selected: boolean }[];
    text_analysis: { id: TextAnalysisCategory; selected: boolean }[];
    emails: { id: string }[];
    topics_discourage: { id: string }[];
    topics_encourage: { id: string }[];
    dont_say: { id: string }[];
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<Values>({
    defaultValues: {
      topics_encourage: profile.data?.topics_encourage?.map(topic => ({ id: topic })) || [],
      topics_discourage: profile.data?.topics_discourage?.map(topic => ({ id: topic })),
      dont_say: profile.data?.dont_say?.map(word => ({ id: word })) || [],
      moderations: DEFAULT_MODERATION_CATEGORIES?.map(moderation => ({
        id: moderation,
        selected: profile.data?.notifications?.moderations?.[moderation] ?? false,
      })),
      text_analysis: DEFAULT_TEXT_ANALYSIS_CATEGORIES?.map(textAnalysis => ({
        id: textAnalysis,
        selected: profile.data?.notifications?.text_analysis?.[textAnalysis] ?? false,
      })),
      emails: profile.data?.notifications?.emails?.map(email => ({ id: email })),
    },
  });

  const fields = useWatch({ control });

  const onSubmit = async ({ topics_discourage, topics_encourage, dont_say, moderations, text_analysis, emails }: Values) => {
    await mutateAsync({
      topics_encourage: topics_encourage.map(({ id }) => id),
      topics_discourage: topics_discourage.map(({ id }) => id),
      dont_say: dont_say.map(({ id }) => id),
      notifications: {
        moderations: DEFAULT_MODERATION_CATEGORIES.reduce(
          (acc, curr) => ({ ...acc, [curr]: !!moderations.find(({ id }) => id === curr)?.selected }),
          {} as Record<ModeratonCategory, boolean>
        ),
        text_analysis: DEFAULT_TEXT_ANALYSIS_CATEGORIES.reduce(
          (acc, curr) => ({ ...acc, [curr]: !!text_analysis.find(({ id }) => id === curr)?.selected }),
          {} as Record<TextAnalysisCategory, boolean>
        ),
        emails: emails.map(({ id }) => id),
      },
    });

    reset({ topics_discourage, dont_say, moderations, text_analysis, emails }, { keepValues: true });
  };

  useEffect(() => {
    if (isDirty) {
      setTimeout(() => {
        handleSubmit(onSubmit)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, isDirty, handleSubmit]);

  const watchTopicsEncourage = useWatch({ control, name: 'topics_encourage' });
  const watchTopicsDiscourage = useWatch({ control, name: 'topics_discourage' });
  const watchWordsDontSay = useWatch({ control, name: 'dont_say' });
  const watchEmails = useWatch({ control, name: 'emails' });

  const { replace: replaceTopicsEncourage } = useFieldArray<Values>({ control, name: 'topics_encourage' });
  const { replace: replaceTopicsDiscourage } = useFieldArray<Values>({ control, name: 'topics_discourage' });
  const { replace: replaceWordsDontSay } = useFieldArray<Values>({ control, name: 'dont_say' });
  const { replace: replaceEmails } = useFieldArray<Values>({ control, name: 'emails' });

  return (
    <MainContainer isFetching={profile.isFetching} header={<AppHeader title={t('profile.moderation')} canGoBack />}
      fab={{
        icon: <HelpDialog
        isAuto={true}
        helpId={'help.moderation'}/>,
      }}>
      <YStack space="$4">
        <Section
          items={watchTopicsEncourage}
          title={t('profile.topic-encouraged')}
          description={t('profile.have-specific-encouragement')}
          onChange={replaceTopicsEncourage}>
          <TopicsSectionDialog type={'topic-encouraged'} topics={watchTopicsEncourage} onChange={replaceTopicsEncourage} />
        </Section>
        <Section
          items={watchTopicsDiscourage}
          title={t('profile.topic-discouraged')}
          description={t('profile.have-specific-restriction')}
          onChange={replaceTopicsDiscourage}>
          <TopicsSectionDialog type={'topic-discouraged'}  topics={watchTopicsDiscourage} onChange={replaceTopicsDiscourage} />
        </Section>

        <Section
          items={watchWordsDontSay}
          title={t('profile.words-dont-say')}
          description={t('profile.words-to-avoid')}
          onChange={replaceWordsDontSay}>
          <WordsSectionDialog words={watchWordsDontSay} onChange={replaceWordsDontSay} />
        </Section>

        <Section
          items={watchEmails}
          title={t('profile.notification-recipient')}
          description={t('profile.include-email')}
          onChange={replaceEmails}>
          <EmailSectionDialog emails={watchEmails} onChange={replaceEmails} />
        </Section>

        <YStack>
          <Text fontSize="$4" fontWeight="600" mb="$1">
            {t('profile.moderation')} ({t('profile.notifications')})
          </Text>
          <Paragraph fontSize="$4" color="$color11" mb="$3">
            {t('profile.select-categories-notifications')}
          </Paragraph>
          <XStack flexWrap="wrap">
            {DEFAULT_MODERATION_CATEGORIES.map((moderation, index) => {
              return (
                <View width="50%" paddingVertical="$2" key={moderation}>
                  <Input display="none" control={control} name={`moderations[${index}].id`} defaultValue={moderation} />
                  <Checkbox control={control} name={`moderations[${index}].selected`}>
                    {t(`common.${moderation}`)}
                  </Checkbox>
                </View>
              );
            })}
            {DEFAULT_TEXT_ANALYSIS_CATEGORIES.map((textAnalysis, index) => {
              return (
                <View width="50%" paddingVertical="$2" key={textAnalysis}>
                  <Input display="none" control={control} name={`text_analysis[${index}].id`} defaultValue={textAnalysis} />
                  <Checkbox control={control} name={`text_analysis[${index}].selected`}>
                    {t(`common.${textAnalysis}`)}
                  </Checkbox>
                </View>
              );
            })}
          </XStack>
        </YStack>
      </YStack>
    </MainContainer>
  );
}
