import reducer from '../auth';
import { Map as ImmutableMap, fromJS } from 'immutable';
import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  VERIFY_CREDENTIALS_SUCCESS,
  VERIFY_CREDENTIALS_FAIL,
  SWITCH_ACCOUNT,
} from 'soapbox/actions/auth';
import { ME_FETCH_SKIP } from 'soapbox/actions/me';
import { MASTODON_PRELOAD_IMPORT } from 'soapbox/actions/preload';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      app: ImmutableMap(),
      users: ImmutableMap(),
      tokens: ImmutableMap(),
      me: null,
    }));
  });

  describe('AUTH_APP_CREATED', () => {
    it('should copy in the app', () => {
      const token = { token_type: 'Bearer', access_token: 'ABCDEFG' };
      const action = { type: AUTH_APP_CREATED, app: token };

      const result = reducer(undefined, action);
      const expected = fromJS(token);

      expect(result.get('app')).toEqual(expected);
    });
  });

  describe('AUTH_LOGGED_IN', () => {
    it('should import the token', () => {
      const token = { token_type: 'Bearer', access_token: 'ABCDEFG' };
      const action = { type: AUTH_LOGGED_IN, token };

      const result = reducer(undefined, action);
      const expected = fromJS({ 'ABCDEFG': token });

      expect(result.get('tokens')).toEqual(expected);
    });

    it('should merge the token with existing state', () => {
      const state = fromJS({
        tokens: { 'ABCDEFG': { token_type: 'Bearer', access_token: 'ABCDEFG' } },
      });

      const expected = fromJS({
        'ABCDEFG': { token_type: 'Bearer', access_token: 'ABCDEFG' },
        'HIJKLMN': { token_type: 'Bearer', access_token: 'HIJKLMN' },
      });

      const action = {
        type: AUTH_LOGGED_IN,
        token: { token_type: 'Bearer', access_token: 'HIJKLMN' },
      };

      const result = reducer(state, action);
      expect(result.get('tokens')).toEqual(expected);
    });
  });

  describe('AUTH_LOGGED_OUT', () => {
    it('deletes the user', () => {
      const action = {
        type: AUTH_LOGGED_OUT,
        account: fromJS({ url: 'https://gleasonator.com/users/alex' }),
      };

      const state = fromJS({
        users: {
          'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
          'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
        },
      });

      const expected = fromJS({
        'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
      });

      const result = reducer(state, action);
      expect(result.get('users')).toEqual(expected);
    });

    it('sets `me` to the next available user', () => {
      const state = fromJS({
        me: 'https://gleasonator.com/users/alex',
        users: {
          'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
          'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
        },
      });

      const action = {
        type: AUTH_LOGGED_OUT,
        account: fromJS({ url: 'https://gleasonator.com/users/alex' }),
      };

      const result = reducer(state, action);
      expect(result.get('me')).toEqual('https://gleasonator.com/users/benis');
    });
  });

  describe('VERIFY_CREDENTIALS_SUCCESS', () => {
    it('should import the user', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const expected = fromJS({
        'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
      });

      const result = reducer(undefined, action);
      expect(result.get('users')).toEqual(expected);
    });

    it('should set the account in the token', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const state = fromJS({
        tokens: { 'ABCDEFG': { token_type: 'Bearer', access_token: 'ABCDEFG' } },
      });

      const expected = fromJS({
        'ABCDEFG': {
          token_type: 'Bearer',
          access_token: 'ABCDEFG',
          account: '1234',
          me: 'https://gleasonator.com/users/alex',
        },
      });

      const result = reducer(state, action);
      expect(result.get('tokens')).toEqual(expected);
    });

    it('sets `me` to the account if unset', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const result = reducer(undefined, action);
      expect(result.get('me')).toEqual('https://gleasonator.com/users/alex');
    });

    it('leaves `me` alone if already set', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const state = fromJS({ me: 'https://gleasonator.com/users/benis' });

      const result = reducer(state, action);
      expect(result.get('me')).toEqual('https://gleasonator.com/users/benis');
    });

    it('deletes mismatched users', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const state = fromJS({
        users: {
          'https://gleasonator.com/users/mk':     { id: '4567', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/mk' },
          'https://gleasonator.com/users/curtis': { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/curtis' },
          'https://gleasonator.com/users/benis':  { id: '5432', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
        },
      });

      const expected = fromJS({
        'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
        'https://gleasonator.com/users/benis': { id: '5432', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
      });

      const result = reducer(state, action);
      expect(result.get('users')).toEqual(expected);
    });

    it('upgrades from an ID to a URL', () => {
      const action = {
        type: VERIFY_CREDENTIALS_SUCCESS,
        token: 'ABCDEFG',
        account: { id: '1234', url: 'https://gleasonator.com/users/alex' },
      };

      const state = fromJS({
        me: '1234',
        users: {
          '1234': { id: '1234', access_token: 'ABCDEFG' },
          '5432': { id: '5432', access_token: 'HIJKLMN' },
        },
        tokens: {
          'ABCDEFG': { access_token: 'ABCDEFG', account: '1234' },
        },
      });

      const expected = fromJS({
        me: 'https://gleasonator.com/users/alex',
        users: {
          'https://gleasonator.com/users/alex': { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
          '5432': { id: '5432', access_token: 'HIJKLMN' },
        },
        tokens: {
          'ABCDEFG': { access_token: 'ABCDEFG', account: '1234', me: 'https://gleasonator.com/users/alex' },
        },
      });

      const result = reducer(state, action);
      expect(result).toEqual(expected);
    });
  });

  describe('VERIFY_CREDENTIALS_FAIL', () => {
    it('should delete the failed token if it 403\'d', () => {
      const state = fromJS({
        tokens: {
          'ABCDEFG': { token_type: 'Bearer', access_token: 'ABCDEFG' },
          'HIJKLMN': { token_type: 'Bearer', access_token: 'HIJKLMN' },
        },
      });

      const expected = fromJS({
        'HIJKLMN': { token_type: 'Bearer', access_token: 'HIJKLMN' },
      });

      const action = {
        type: VERIFY_CREDENTIALS_FAIL,
        token: 'ABCDEFG',
        error: { response: { status: 403 } },
      };

      const result = reducer(state, action);
      expect(result.get('tokens')).toEqual(expected);
    });

    it('should delete any users associated with the failed token', () => {
      const state = fromJS({
        users: {
          'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
          'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
        },
      });

      const expected = fromJS({
        'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
      });

      const action = {
        type: VERIFY_CREDENTIALS_FAIL,
        token: 'ABCDEFG',
        error: { response: { status: 403 } },
      };

      const result = reducer(state, action);
      expect(result.get('users')).toEqual(expected);
    });

    it('should reassign `me` to the next in line', () => {
      const state = fromJS({
        me: 'https://gleasonator.com/users/alex',
        users: {
          'https://gleasonator.com/users/alex':  { id: '1234', access_token: 'ABCDEFG', url: 'https://gleasonator.com/users/alex' },
          'https://gleasonator.com/users/benis': { id: '5678', access_token: 'HIJKLMN', url: 'https://gleasonator.com/users/benis' },
        },
      });

      const action = {
        type: VERIFY_CREDENTIALS_FAIL,
        token: 'ABCDEFG',
        error: { response: { status: 403 } },
      };

      const result = reducer(state, action);
      expect(result.get('me')).toEqual('https://gleasonator.com/users/benis');
    });
  });

  describe('SWITCH_ACCOUNT', () => {
    it('sets the value of `me`', () => {
      const action = {
        type: SWITCH_ACCOUNT,
        account: fromJS({ url: 'https://gleasonator.com/users/benis' }),
      };

      const result = reducer(undefined, action);
      expect(result.get('me')).toEqual('https://gleasonator.com/users/benis');
    });
  });

  describe('ME_FETCH_SKIP', () => {
    it('sets `me` to null', () => {
      const state = fromJS({ me: 'https://gleasonator.com/users/alex' });
      const action = { type: ME_FETCH_SKIP };
      const result = reducer(state, action);
      expect(result.get('me')).toEqual(null);
    });
  });

  describe('MASTODON_PRELOAD_IMPORT', () => {
    it('imports the user and token', () => {
      const action = {
        type: MASTODON_PRELOAD_IMPORT,
        data: require('soapbox/__fixtures__/mastodon_initial_state.json'),
      };

      const expected = fromJS({
        me: 'https://mastodon.social/@benis911',
        app: {},
        users: {
          'https://mastodon.social/@benis911': {
            id: '106801667066418367',
            access_token: 'Nh15V9JWyY5Fshf2OJ_feNvOIkTV7YGVfEJFr0Y0D6Q',
            url: 'https://mastodon.social/@benis911',
          },
        },
        tokens: {
          'Nh15V9JWyY5Fshf2OJ_feNvOIkTV7YGVfEJFr0Y0D6Q': {
            access_token: 'Nh15V9JWyY5Fshf2OJ_feNvOIkTV7YGVfEJFr0Y0D6Q',
            account: '106801667066418367',
            me: 'https://mastodon.social/@benis911',
            scope: 'read write follow push',
            token_type: 'Bearer',
          },
        },
      });

      const result = reducer(undefined, action);
      expect(result).toEqual(expected);
    });
  });
});
