import reducer from '../status_lists';

describe('status_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      favourites: {
        next: null,
        loaded: false,
        isLoading: null,
        items: [],
      },
      bookmarks: {
        next: null,
        loaded: false,
        isLoading: null,
        items: [],
      },
      pins: {
        next: null,
        loaded: false,
        isLoading: null,
        items: [],
      },
      scheduled_statuses: {
        next: null,
        loaded: false,
        isLoading: null,
        items: [],
      },
    });
  });
});
