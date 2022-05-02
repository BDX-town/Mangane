import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';

import { fetchRules, RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS } from '../rules';

describe('fetchRules()', () => {
  it('sets the rules', (done) => {
    const rules = require('soapbox/__fixtures__/rules.json');

    __stub((mock) => {
      mock.onGet('/api/v1/instance/rules').reply(200, rules);
    });

    const store = mockStore(rootState);

    store.dispatch(fetchRules()).then((context) => {
      const actions = store.getActions();

      expect(actions[0].type).toEqual(RULES_FETCH_REQUEST);
      expect(actions[1].type).toEqual(RULES_FETCH_SUCCESS);
      expect(actions[1].payload[0].id).toEqual('1');

      done();
    }).catch(console.error);
  });
});
