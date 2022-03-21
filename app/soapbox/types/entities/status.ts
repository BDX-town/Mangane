/**
 * Status entity.
 * https://docs.joinmastodon.org/entities/status/
 **/

import { StatusRecord } from 'soapbox/normalizers';

type Status = ReturnType<typeof StatusRecord>

export default Status;
