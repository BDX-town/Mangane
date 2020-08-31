import { ConfigDB } from '../config_db';
import config_db from 'soapbox/__fixtures__/config_db.json';
import { fromJS } from 'immutable';

test('find', () => {
  const configs = fromJS(config_db).get('configs');
  expect(ConfigDB.find(configs, ':phoenix', ':json_library')).toEqual(fromJS({
    group: ':phoenix',
    key: ':json_library',
    value: 'Jason',
  }));
});
