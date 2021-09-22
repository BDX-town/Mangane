import {
  MASTODON_PRELOAD_IMPORT,
  preloadMastodon,
} from '../preload';
import { ACCOUNTS_IMPORT } from '../importer';
import { Map as ImmutableMap } from 'immutable';
import { mockStore } from 'soapbox/test_helpers';

describe('preloadMastodon()', () => {
  it('creates the expected actions', () => {
    const data = require('soapbox/__fixtures__/mastodon_initial_state.json');

    const store = mockStore(ImmutableMap());
    store.dispatch(preloadMastodon(data));
    const actions = store.getActions();

    expect(actions[0].type).toEqual(ACCOUNTS_IMPORT);
    expect(actions[0].accounts[0].username).toEqual('Gargron');
    expect(actions[0].accounts[1].username).toEqual('benis911');

    expect(actions[1]).toEqual({ type: MASTODON_PRELOAD_IMPORT, data });
  });
});
