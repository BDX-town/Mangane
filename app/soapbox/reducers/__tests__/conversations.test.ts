import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import * as actions from 'soapbox/actions/conversations';

import reducer from '../conversations';

describe('conversations reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toMatchObject({
      items: ImmutableList(),
      isLoading: false,
      hasMore: true,
      mounted: 0,
    });
  });

  it('should handle CONVERSATIONS_FETCH_REQUEST', () => {
    const state = ImmutableRecord({ isLoading: false })();
    const action = {
      type: actions.CONVERSATIONS_FETCH_REQUEST,
    };
    expect(reducer(state as any, action).toJS()).toMatchObject({
      isLoading: true,
    });
  });

  it('should handle CONVERSATIONS_FETCH_FAIL', () => {
    const state = ImmutableRecord({ isLoading: true })();
    const action = {
      type: actions.CONVERSATIONS_FETCH_FAIL,
    };
    expect(reducer(state as any, action).toJS()).toMatchObject({
      isLoading: false,
    });
  });

  // it('should handle the Action CONVERSATIONS_MOUNT', () => {
  //   expect(
  //     reducer(
  //       {
  //         mounted: false,
  //       },
  //       {
  //         type: 'CONVERSATIONS_MOUNT',
  //       },
  //     ),
  //   ).toEqual({
  //     mounted: true,
  //   });
  // });
  //
  // it('should handle the Action CONVERSATIONS_UNMOUNT', () => {
  //   expect(
  //     reducer(
  //       {
  //         mounted: true,
  //       },
  //       {
  //         type: 'CONVERSATIONS_UNMOUNT',
  //       },
  //     ),
  //   ).toEqual({
  //     mounted: false,
  //   });
  // });

});
