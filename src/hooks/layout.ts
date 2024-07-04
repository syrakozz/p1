import { useQueryAccount, useQueryPreferences } from '$hooks';

export function useLayoutData() {
  const preferences = useQueryPreferences();
  const account = useQueryAccount();

  return {
    data: { preferences: preferences.data, account: account.data },
    isFetched: preferences.isFetched && account.isFetched,
    isFetching: preferences.isFetching || account.isFetching,
  };
}
