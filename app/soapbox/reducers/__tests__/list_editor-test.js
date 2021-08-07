import reducer from '../list_editor';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import * as actions from 'soapbox/actions/lists';

describe('list_editor reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      listId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    }));
  });

  it('should handle LIST_EDITOR_RESET', () => {
    const state = ImmutableMap({
      listId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    });
    const action = {
      type: actions.LIST_EDITOR_RESET,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      listId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    }));
  });

  it('should handle LIST_EDITOR_SETUP', () => {
    const state = ImmutableMap({
      listId: null,
      isSubmitting: false,
      isChanged: false,
      title: '',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    });
    const action = {
      type: actions.LIST_EDITOR_SETUP,
      list: ImmutableMap({
        id: '22',
        title: 'list 1',
      }),
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      listId: '22',
      isSubmitting: false,
      isChanged: false,
      title: 'list 1',

      accounts: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),

      suggestions: ImmutableMap({
        value: '',
        items: ImmutableList(),
      }),
    }));
  });

  it('should handle LIST_EDITOR_TITLE_CHANGE', () => {
    const state = ImmutableMap({
      title: 'list 1',
      isChanged: false,
    });
    const action = {
      type: actions.LIST_EDITOR_TITLE_CHANGE,
      value: 'list 1 edited',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      isChanged: true,
      title: 'list 1 edited',
    });
  });

  it('should handle LIST_UPDATE_REQUEST', () => {
    const state = ImmutableMap({
      isSubmitting: false,
      isChanged: true,
    });
    const action = {
      type: actions.LIST_UPDATE_REQUEST,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      isSubmitting: true,
      isChanged: false,
    });
  });

  it('should handle LIST_UPDATE_FAIL', () => {
    const state = ImmutableMap({
      isSubmitting: true,
    });
    const action = {
      type: actions.LIST_UPDATE_FAIL,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      isSubmitting: false,
    });
  });

});
