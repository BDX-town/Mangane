import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

import type { Account } from 'soapbox/types/entities';

// FIXME: There is no reason this selector shouldn't be global accross the whole app
// FIXME: getAccount() has the wrong type??
const getAccount: (state: any, accountId: any) => any = makeGetAccount();

/** Get the logged-in account from the store, if any */
export const useOwnAccount = (): Account | null => {
  return useAppSelector((state) =>  getAccount(state, state.me));
};
