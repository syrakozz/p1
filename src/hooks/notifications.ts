import { useMutation, useQuery } from '@tanstack/react-query';
import { getNotifications, getNotification, updateNotification } from '../api/vox.api';
import { queryClient } from '../../config';
import { Notification } from '../api/vox.types';

export function useQueryNotifications() {
  return useQuery(['notifications'], () => getNotifications(), {
    // TODO: invalidate when notification is received from firestore
    staleTime: 0,
  });
}

export function useQueryNotification(notificationId: string) {
  return useQuery(['notification', notificationId], () => getNotification(notificationId));
}

export function useMutateNotification() {
  return useMutation(
    ['updateNotification'],
    ({ id, ...data }: { id: string; read?: boolean; inactive?: boolean }) => updateNotification(id, data),
    {
      onSuccess(data) {
        queryClient.setQueryData<Notification[]>(
          ['notifications'],
          notifications =>
            notifications
              ?.map(notification => (notification.id === data.id ? data : notification))
              .filter(notification => !notification.inactive)
        );
      },
    }
  );
}
