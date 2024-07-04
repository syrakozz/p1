import base64 from 'react-native-base64';
import { _send, buildFullPath, http } from '../services/http.service';
import { useUserStore } from '../services/stores/user.store';
import {
  Account,
  Profile,
  AccountPreferences,
  ArchiveEntry,
  ArchiveSummary,
  Notification,
  RobotStatus,
  Characters,
  CharacterVoice,
  CharacterMode,
  CharacterLanguage,
  CharacterEntry,
  AccountReqPayload,
} from './vox.types';

export function toProfile<T extends Partial<Profile>>(profile: T) {
  return {
    selected_character: '2-xl',
    ...profile,
    characters: {
      '2-xl': {
        language: 'en-US' as const,
        mode: 'conversation' as const,
        voice: 'default' as const,
        image_style: 'comic-book' as const,
      } satisfies CharacterEntry,
      ...profile.characters,
    },
  } satisfies T;
}

export const DEFAULT_ACCOUNT_PREFERENCES = {
  '2xl:isFirstLogin': true,
  '2xl:language': 'en' as const,
  '2xl:talkingMode': 'auto',
  '2xl:hasInsightFiller': true,
  '2xl:hasThinkingFiller': true,
} satisfies AccountPreferences;

export function getCharacterVersion(character?: string) {
  return `${character || '2-xl'}_v1`;
}

export async function createProfile(data: Partial<Profile>) {
  const response = await http.post<Profile>('/api/vox/profiles', data).then(toProfile);

  // try {
  //   await http.post<void>(`/api/vox/accounts/me/characters/${character}`, {});
  // } catch {}

  return response;
}

export function updateProfile(id: string, data: Partial<Profile>) {
  return http.patch<Profile>(`/api/vox/profiles/${id}`, data).then(toProfile);
}

export function getProfiles() {
  return http.get<Profile[]>('/api/vox/profiles').then(profiles => profiles.filter(({ id }) => id).map(toProfile));
}

export function getProfile(profileId: string) {
  return http.get<Profile>(`/api/vox/profiles/${profileId}`).then(toProfile);
}

export async function deleteProfile(profileId: string) {
  await http.del<void>(`/api/vox/profiles/${profileId}`);
  return profileId;
}

export function getMyAccount() {
  return http.get<Account>('/api/vox/accounts/me');
}

export function updateMyAccount(data: AccountReqPayload) {
  return http.patch<Account>('/api/vox/accounts/me', data);
}

export async function deleteMyAccount() {
  return http.del<void>('/api/vox/accounts/me');
}

export function getMyPreferences() {
  return http
    .get<AccountPreferences>('/api/vox/accounts/preferences')
    .then(preferences => ({ ...DEFAULT_ACCOUNT_PREFERENCES, ...preferences }) satisfies AccountPreferences);
}

export function updateMyPreferences(preferences: AccountPreferences) {
  return http.patch<AccountPreferences>('/api/vox/accounts/preferences', preferences);
}

export function getProfilePreferences(profileId: string) {
  return http.get<Profile>(`/api/vox/profiles/${profileId}/preferences`);
}

export function updateProfilePreferences(profileId: string, preferences: unknown) {
  return http.patch<unknown>(`/api/vox/profiles/${profileId}/preferences`, preferences);
}

export function sendPinEmail() {
  return http.post<void>('/api/vox/accounts/me/email_pin', {});
}

export async function uploadAudioFile(fileUri: string, profileId: string, characterVersion: string) {
  const filename = fileUri.split('/').pop();

  const formData = new FormData();
  formData.append('file', { uri: fileUri, name: filename, type: 'audio/wav' });

  return http.post<{ audio_id: string; text: string }>(
    `/api/vox/play/${profileId}/${characterVersion}/sts/audio/file?format=wav`,
    formData
  );
}

export async function getAudio(audioId: string, profileId: string, characterVersion: string, format: 'mp3_22050_32') {
  const { user } = useUserStore.getState();
  const authToken = await user?.getIdToken();

  return `${buildFullPath({
    path: `/api/vox/play/${profileId}/${characterVersion}/sts/audio/${audioId}`,
  })}?authorization=${authToken}&format=${format}&optimize_streaming_latency=1`;
}

export async function getText(profileId: string, characterVersion: string, audioId: string) {
  return http.get<{ assistant: string; user: string; id: number }>(`/api/vox/play/${profileId}/${characterVersion}/sts/text/${audioId}`);
}

export async function getModeration(profileId: string, characterVersion: string, audioId: string) {
  return http.get<{ analysis: { pegi_rating: number }; triggered: boolean }>(
    `/api/vox/play/${profileId}/${characterVersion}/sts/moderation/${audioId}`
  );
}

export async function closeAudio(profileId: string, characterVersion: string, audioId: string) {
  return http.post<{ moderation_email_sent: boolean; notification_id: string }>(
    `/api/vox/play/${profileId}/${characterVersion}/sts/close/${audioId}`,
    {}
  );
}

export async function getArchiveEntries(profileId: string, characterVersion: string, startDate: string, endDate: string) {
  return http
    .get<{ entries: Record<string, ArchiveEntry> }>(
      `/api/vox/profiles/${profileId}/characters/${characterVersion}/archives/entries/date_range`,
      {
        params: { start_date: startDate, end_date: endDate },
      }
    )
    .then(payload => Object.values(payload.entries))
    .catch(() => []);
}

export async function getArchiveSummaries(profileId: string, characterVersion: string, startDate: string, endDate: string) {
  return http
    .get<ArchiveSummary[]>(`/api/vox/profiles/${profileId}/characters/${characterVersion}/archives/summaries/date_range`, {
      params: { start_date: startDate, end_date: endDate },
    })
    .catch(() => []);
}

export async function getNotifications() {
  return (await http.get<Notification[]>('/api/vox/notifications')).filter(notification => !notification.inactive);
}

export async function getNotification(notificationId: string) {
  return http.get<Notification>(`/api/vox/notifications/${notificationId}`);
}

export async function updateNotification(notificationId: string, data: { read?: boolean; inactive?: boolean }) {
  return http.patch<Notification>(`/api/vox/notifications/${notificationId}`, data);
}

export async function updateRobotStatus(status: RobotStatus, id: string) {
  return http.patch<{ status: RobotStatus }>(`/api/vox/demo/${id}`, { status });
}

export async function getCharacters() {
  return http.get<Characters>('/api/vox/configs/characters').then(data =>
    Object.entries(data)
      .map(([key, value]) => {
        const { voices, ...rest } = value.versions.v1;

        return {
          key,
          name: value.name,
          // default option shouldn't be displayed on the UI.
          // if there is only one option remaining after the filtering, the UI shouldn't show the respective input at all
          voices: voices.filter(voice => voice !== 'default'),
          ...rest,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  );
}

export async function updateProfileCharacter(
  profileId: string,
  characterName: string,
  data: { voice?: CharacterVoice | null; language?: CharacterLanguage | null; mode?: CharacterMode | null }
) {
  return http.patch<Profile>(`/api/vox/profiles/${profileId}/characters/${characterName}`, data);
}

export async function getAdHocAudio(text: string, activeProfile: Profile, format: 'mp3_22050_32') {
  const { _fetch } = await _send('/api/lib/defaults/tts', {
    method: 'POST',
    body: {
      text,
      format,
      voice: '2xl',
      language: activeProfile.characters?.[activeProfile.selected_character as string].language ?? 'en-US',
    } as any,
  });

  const response = await _fetch();
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = Array.from(new Uint8Array(arrayBuffer));

  return uint8Array;
}

export async function tti(profileId: string, characterVersion: string) {
  const { _fetch } = await _send(`/api/vox/play/${profileId}/${characterVersion}/tti`);
  const response = await _fetch();
  const arrayBuffer = await response.arrayBuffer();

  return base64.encodeFromByteArray(new Uint8Array(arrayBuffer));
}

export async function getCharacterImageStyles() {
  return http.get<string[]>('/api/vox/configs/tti/styles');
}

export async function connectDevice(deviceId: string, characterName: string) {
  return http.post<{ balance: number; first_time: boolean; first_time_balance_added: number; valid_id: boolean }>(
    `/api/vox/accounts/me/products/${characterName}/${deviceId}/connect`,
    null
  );
}

export async function sendIAPReceiptAndroid(data: any) {
  return http.post<any>('/api/vox/bank/android/iap/transaction', data);
}

export async function sendIAPReceiptIOS(data: any) {
  return http.post<any>('/api/vox/bank/apple/iap/transaction', data);
}
