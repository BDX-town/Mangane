import api from 'soapbox/api';
import { getState } from 'soapbox/test_helpers';

test('returns a 404', () => {
  return api(getState).get('/').catch(error => {
    expect(error.response).toMatchObject({ data: { error: 'Not implemented' } });
  });
});
