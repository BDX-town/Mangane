import reducer from '../soapbox';
import { Map as ImmutableMap } from 'immutable';
import * as actions from 'soapbox/actions/soapbox';
import soapbox from 'soapbox/__fixtures__/soapbox.json';
import frontend_config from 'soapbox/__fixtures__/admin_api_frontend_config.json';

describe('soapbox reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  it('should handle SOAPBOX_CONFIG_REQUEST_SUCCESS', () => {
    const state = ImmutableMap({ brandColor: '#354e91' });
    const action = {
      type: actions.SOAPBOX_CONFIG_REQUEST_SUCCESS,
      soapboxConfig: frontend_config,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      brandColor: '#254f92',
    });
  });

  it('should handle SOAPBOX_CONFIG_REQUEST_FAIL', () => {
    const state = ImmutableMap({ skipAlert: false });
    const action = {
      type: actions.SOAPBOX_CONFIG_REQUEST_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      skipAlert: true,
    });
  });

  it('should handle SOAPBOX_POST_SUCCESS', () => {
    const state = ImmutableMap({ brandColor: '#354e91' });
    const action = {
      type: actions.SOAPBOX_POST_SUCCESS,
      brandColor: soapbox.get('brandColor'),
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      brandColor: '#254f92',
    });
  });

});
