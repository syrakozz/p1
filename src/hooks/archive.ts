import { useQuery } from '@tanstack/react-query';
import { getArchiveEntries, getArchiveSummaries } from '../api/vox.api';
import dayjs from 'dayjs';

export function useQueryArchiveEntries(
  profileId: string,
  characterVersion: string,
  selectedDate: string,
  { enabled }: { enabled?: boolean }
) {
  const startDate = dayjs(selectedDate).startOf('day').toISOString();
  const endDate = dayjs(selectedDate).endOf('day').toISOString();

  return useQuery(['archive-entries', profileId], () => getArchiveEntries(profileId, characterVersion, startDate, endDate), {
    enabled,
    cacheTime: 0,
  });
}

export function useQueryArchiveSummaries(
  profileId: string,
  characterVersion: string,
  selectedDate: string,
  { enabled }: { enabled?: boolean }
) {
  const startDate = dayjs(selectedDate).startOf('day').toISOString();
  const endDate = dayjs(selectedDate).endOf('day').toISOString();

  return useQuery(['summaries', profileId, selectedDate], () => getArchiveSummaries(profileId, characterVersion, startDate, endDate), {
    enabled,
    cacheTime: 0,
  });
}
