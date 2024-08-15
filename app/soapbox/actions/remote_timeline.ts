import { List as ImmutableList, Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

import { getSettings, changeSetting } from 'soapbox/actions/settings';

import type { AppDispatch, RootState } from 'soapbox/store';

const getPinnedHosts = (state: RootState) => {
  const settings = getSettings(state);
  // return ImmutableList([]);
  return ImmutableOrderedSet(settings.getIn(['remote_timeline', 'pinnedHosts']) as ImmutableList<ImmutableMap<string, string>>);
};

const pinHost = (host: string, favicon: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(ImmutableMap<string, string>({ host, favicon }))));
  };

const unpinHost = (host: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.filter((h) => h.get('host') !== host)));
  };

export {
  getPinnedHosts,
  pinHost,
  unpinHost,
};
