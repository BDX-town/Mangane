import { STATUSES_IMPORT } from 'soapbox/actions/importer';
import { server, rest } from 'soapbox/msw';
import { rootState, mockStore } from 'soapbox/test_helpers';

import { fetchContext } from '../statuses';

describe('fetchContext()', () => {
  it('handles Mitra context', done => {
    server.use(
      rest.get('/api/v1/statuses/017ed505-5926-392f-256a-f86d5075df70/context', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(require('soapbox/__fixtures__/mitra-context.json')),
        );
      }),
    );

    const store = mockStore(rootState);

    store.dispatch(fetchContext('017ed505-5926-392f-256a-f86d5075df70')).then(context => {
      const actions = store.getActions();

      expect(actions[3].type).toEqual(STATUSES_IMPORT);
      expect(actions[3].statuses[0].id).toEqual('017ed503-bc96-301a-e871-2c23b30ddd05');

      done();
    }).catch(console.error);
  });
});
