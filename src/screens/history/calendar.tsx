import React from 'react';
import { useTheme } from 'tamagui';
import { Calendar as RNCalendar, CalendarProps as RNCalendarProps } from 'react-native-calendars';

export type CalendarProps = { selectedDate: string } & RNCalendarProps;

export default function Calendar({ selectedDate, ...rest }: CalendarProps) {
  const theme = useTheme();
  const primaryTheme = useTheme({ name: 'primary' });

  return (
    <RNCalendar
      theme={{
        backgroundColor: theme.background.val,
        calendarBackground: theme.background.val,
        monthTextColor: theme.color12.val,
        textSectionTitleColor: theme.color12.val,
        selectedDayBackgroundColor: primaryTheme.color10.val,
        selectedDayTextColor: primaryTheme.color1.val,
        todayTextColor: primaryTheme.color10.val,
        dayTextColor: theme.color12.val,
        textDisabledColor: theme.color9.val,
        arrowColor: primaryTheme.color10.val,
        textSectionTitleDisabledColor: theme.color9.val,
        disabledArrowColor: theme.color9.val,
      }}
      markedDates={{
        [selectedDate]: { selected: true, disableTouchEvent: true },
      }}
      {...rest}
    />
  );
}
