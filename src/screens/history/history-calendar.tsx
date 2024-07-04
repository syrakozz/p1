import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button } from '$components';
import { MainContainer } from '$layout';
import Calendar from './calendar';
import { Text } from 'tamagui';
import dayjs from 'dayjs';
import { HistoryStackParamList } from './history.navigator';
import HistoryHeader from './history-header';
import { useHistoryStore } from '../../services/stores/history.store';
import { Alert } from 'react-native';
import HelpDialog from '../help/help-dialog';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryCalendar'>;

export default function HistoryCalendarScreen(): JSX.Element {
  const { t } = useTranslation();
  const nav = useNavigation<Props['navigation']>();
  const { reviewProfile, selectedDate, setSelectedDate } = useHistoryStore();
  const currentMonth = dayjs().get('month');
  const currentYear = dayjs().get('year');
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <MainContainer
      header={<HistoryHeader title={t('history.history')} subtitle={t('history.select-a-date')} />}
      footer={
        reviewProfile ? (
          <Button
            theme="primary"
            fontWeight="600"
            size="$7"
            disabled={!selectedDate}
            onPress={() => nav.navigate('HistoryReview', { selectedDate })}>
            {t('history.review')}
          </Button>
        ) : (
          <Text textAlign="center">{t('history.create-profile')}</Text>
        )
      }
      fab={{
        icon: <HelpDialog
        isAuto={true}
        helpId={'help.history'}/>,
      }}
      >
      <Calendar
        style={{ borderRadius: 5 }}
        hideExtraDays
        disableArrowRight={isDisabled}
        disableAllTouchEventsForInactiveDays
        maxDate={dayjs().startOf('day').toString()}
        selectedDate={selectedDate}
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        onMonthChange={m => {
          setIsDisabled(m.year > currentYear || (m.year === currentYear && m.month >= currentMonth + 1));
        }}
      />
    </MainContainer>
  );
}
