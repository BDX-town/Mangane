import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import * as actions from 'soapbox/actions/lists';

import reducer from '../list_adder';

describe('list_adder reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    }));
  });

  it('should handle LIST_ADDER_RESET', () => {
    const state = ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    });
    const action = {
      type: actions.LIST_ADDER_RESET,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    }));
  });

  it('should handle LIST_ADDER_LISTS_FETCH_REQUEST', () => {
    const state = ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    });
    const action = {
      type: actions.LIST_ADDER_LISTS_FETCH_REQUEST,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: true,
      }),
    }));
  });

  it('should handle LIST_ADDER_LISTS_FETCH_FAIL', () => {
    const state = ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    });
    const action = {
      type: actions.LIST_ADDER_LISTS_FETCH_FAIL,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    }));
  });

  // it('should handle LIST_ADDER_LISTS_FETCH_SUCCESS', () => {
  //   const state = ImmutableMap({
  //     accountId: null,
  //
  //     lists: ImmutableMap({
  //       items: ImmutableList(),
  //       loaded: false,
  //       isLoading: false,
  //     }),
  //   });
  //   const action = {
  //     type: actions.LIST_ADDER_LISTS_FETCH_SUCCESS,
  //   };
  //   expect(reducer(state, action)).toEqual(ImmutableMap({
  //     accountId: null,
  //
  //     lists: ImmutableMap({
  //       items: ImmutableList(),
  //       loaded: true,
  //       isLoading: false,
  //     }),
  //   }));
  // });

});
