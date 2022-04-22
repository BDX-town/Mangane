import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import { ACCOUNT_IMPORT } from 'soapbox/actions/importer';

import reducer from '../accounts';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('ACCOUNT_IMPORT', () => {
    it('parses the account as a Record', () => {
      const account = require('soapbox/__fixtures__/pleroma-account.json');
      const action = { type: ACCOUNT_IMPORT, account };
      const result = reducer(undefined, action).get('9v5bmRalQvjOy0ECcC');

      expect(ImmutableRecord.isRecord(result)).toBe(true);
    });

    it('minifies a moved account', () => {
      const account = require('soapbox/__fixtures__/account-moved.json');
      const action = { type: ACCOUNT_IMPORT, account };
      const result = reducer(undefined, action).get('106801667066418367');

      expect(result.moved).toBe('107945464165013501');
    });
  });
});
