/**
 * Account entity.
 * https://docs.joinmastodon.org/entities/account/
 **/

import { AccountRecord } from 'soapbox/normalizers';

type Account = ReturnType<typeof AccountRecord>

export default Account;
