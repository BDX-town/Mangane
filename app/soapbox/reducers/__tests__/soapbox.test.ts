import { Map as ImmutableMap } from 'immutable';

import soapboxConfig from 'soapbox/__fixtures__/admin_api_frontend_config.json';
import soapbox from 'soapbox/__fixtures__/soapbox.json';
import { ADMIN_CONFIG_UPDATE_SUCCESS } from 'soapbox/actions/admin';
import * as actions from 'soapbox/actions/soapbox';

import reducer from '../soapbox';

describe('soapbox reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  it('should handle SOAPBOX_CONFIG_REQUEST_SUCCESS', () => {
    const state = ImmutableMap({ brandColor: '#354e91' });
    const action = {
      type: actions.SOAPBOX_CONFIG_REQUEST_SUCCESS,
      soapboxConfig: soapbox,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      brandColor: '#254f92',
    });
  });

  // it('should handle SOAPBOX_CONFIG_REQUEST_FAIL', () => {
  //   const state = ImmutableMap({ skipAlert: false, brandColor: '#354e91' });
  //   const action = {
  //     type: actions.SOAPBOX_CONFIG_REQUEST_FAIL,
  //     skipAlert: true,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     skipAlert: true,
  //     brandColor: '#354e91',
  //   });
  // });

  it('should handle ADMIN_CONFIG_UPDATE_SUCCESS', () => {
    const state = ImmutableMap({ brandColor: '#354e91' });
    const action = {
      type: ADMIN_CONFIG_UPDATE_SUCCESS,
      configs: soapboxConfig.configs,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      brandColor: '#254f92',
    });
  });

});
