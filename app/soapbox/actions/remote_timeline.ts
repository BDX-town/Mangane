import { getSettings, changeSetting } from 'soapbox/actions/settings';

import type { OrderedSet as ImmutableOrderedSet } from 'immutable';
import type { AppDispatch, RootState } from 'soapbox/store';

const getPinnedHosts = (state: RootState) => {
  const settings = getSettings(state);
  return settings.getIn(['remote_timeline', 'pinnedHosts']) as ImmutableOrderedSet<string>;
};

const pinHost = (host: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(host)));
  };

const unpinHost = (host: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.remove(host)));
  };

export {
  pinHost,
  unpinHost,
};
