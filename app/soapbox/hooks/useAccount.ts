import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

import type Account from 'soapbox/types/entities/account';

// FIXME: There is no reason this selector shouldn't be global accross the whole app
// FIXME: getAccount() has the wrong type??
const getAccount: (state: any, accountId: any) => any = makeGetAccount();

/** Get an account from the store (by default, your own account) */
export const useAccount = (accountId?: string): Account => {
  return useAppSelector((state) =>  getAccount(state, accountId || state.me));
};
