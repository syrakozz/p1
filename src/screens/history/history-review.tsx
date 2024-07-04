import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../../layout/main-container';
import { H3, Separator, SizableText, Text, ToggleGroup, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useQueryArchiveEntries, useQueryArchiveSummaries } from '$hooks';
import { ArchiveEntry, ArchiveSummary } from '../../api/vox.types';
import { HistoryStackParamList } from './history.navigator';
import dayjs from 'dayjs';
import HistoryHeader from './history-header';
import { useHistoryStore } from '../../services/stores/history.store';
import { getCharacterVersion } from '../../api/vox.api';
import { emptyCharacter } from '../../services/stores/chat/chat.types';
import { useActiveProfileStore } from '../../services/stores/profile.store';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryReview'>;
type Tab = 'archive' | 'summary';

export default function HistoryReviewScreen({ route }: Props): JSX.Element {
  const { t } = useTranslation();
  const { selectedDate } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('archive');
  const { reviewProfile } = useHistoryStore();
  const { isFetching: isActiveProfileFetching } = useActiveProfileStore();

  const summaries = useQueryArchiveSummaries(
    reviewProfile?.id as string,
    getCharacterVersion(reviewProfile?.selected_character),
    selectedDate,
    {
      enabled: !!reviewProfile && activeTab === 'summary',
    }
  );

  const entries = useQueryArchiveEntries(
    reviewProfile?.id as string,
    getCharacterVersion(reviewProfile?.selected_character),
    selectedDate,
    {
      enabled: !!reviewProfile && activeTab === 'archive',
    }
  );

  const isFetching =
    isActiveProfileFetching || (activeTab === 'summary' && summaries.isFetching) || (activeTab === 'archive' && entries.isFetching);

  function onRefresh() {
    if (activeTab === 'summary') {
      summaries.refetch();
    } else if (activeTab === 'archive') {
      entries.refetch();
    }
  }

  return (
    <MainContainer
      onRefresh={onRefresh}
      isFetching={isFetching}
      header={<HistoryHeader title={dayjs(selectedDate).format('ll')} canGoBack />}
      autoScrollToEnd
      footer={
        <ToggleGroup type="single" size="$4" value={activeTab} onValueChange={(value: Tab) => setActiveTab(value)} disableDeactivation>
          <ToggleGroup.Item value="archive" flex={1}>
            <Text>{t('history.archive')}</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="summary" flex={1}>
            <Text>{t('history.summary')}</Text>
          </ToggleGroup.Item>
        </ToggleGroup>
      }>
      {activeTab === 'archive' ? (
        <>{entries.data && <ArchiveEntryList archiveEntries={entries.data} />}</>
      ) : (
        <>{summaries.data && <ArchiveSummaryList archiveSummaries={summaries.data} />}</>
      )}
    </MainContainer>
  );
}

function ArchiveEntryList({ archiveEntries }: { archiveEntries: ArchiveEntry[] }) {
  const { t } = useTranslation();

  if (archiveEntries.length === 0) {
    return <SizableText textAlign="center">{t('common.no-data-available')}</SizableText>;
  }

  return (
    <YStack space="$2">
      {archiveEntries.map(({ assistant, user }, index) => {
        return (
          <YStack space="$2" key={index}>
            <XStack justifyContent="flex-end">
              <XStack br="$4" bg="$color5" px="$3" py="$2" alignItems="center" space="$4" flexShrink={1} theme="subtle">
                <SizableText flexShrink={1}>{user || emptyCharacter}</SizableText>
              </XStack>
            </XStack>

            <XStack br="$4" bg="$color5" px="$3" py="$2" alignItems="center" space="$4" flex={1} theme="primary">
              <SizableText flexShrink={1}>{assistant}</SizableText>
            </XStack>
          </YStack>
        );
      })}
    </YStack>
  );
}

function ArchiveSummaryList({ archiveSummaries }: { archiveSummaries: ArchiveSummary[] }) {
  const { t } = useTranslation();

  if (archiveSummaries.length === 0) {
    return <SizableText textAlign="center">{t('common.no-data-available')}</SizableText>;
  }

  return (
    <YStack space="$3.5">
      {archiveSummaries?.map(({ analysis, topic, topic_summary, user_summary }, index) => (
        <YStack p="$3" borderRadius="$5" key={index} borderWidth={1} borderColor="$borderColor" bg="$background">
          <H3 fontWeight="600">{topic}</H3>
          {analysis ? (
            <SizableText>{analysis}</SizableText>
          ) : (
            <YStack space="$2">
              {user_summary && <SizableText>{user_summary}</SizableText>}
              {user_summary && topic_summary && <Separator />}
              {topic_summary && <SizableText>{topic_summary}</SizableText>}
            </YStack>
          )}
        </YStack>
      ))}
    </YStack>
  );
}
