import reducer from '../auth';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import * as actions from '../auth';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      app: ImmutableMap(),
      user: ImmutableMap(),
      tokens: ImmutableList(),
    }));
  });

  it('should handle AUTH_APP_CREATED', () => {
    const state = ImmutableMap({ });
    const action = {
      type: actions.AUTH_APP_CREATED,
      app: 'soapbox',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
    });
  });

});
