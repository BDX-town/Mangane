import { getSettings, changeSetting } from 'soapbox/actions/settings';

import type { AppDispatch, RootState } from 'soapbox/store';

const getPinnedHosts = (state: RootState) => {
  const settings = getSettings(state);
  return settings.getIn(['remote_timeline', 'pinnedHosts']);
};

const pinHost = (host: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.push(host)));
  };

const unpinHost = (host) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.filter((value) => value !== host)));
  };

export {
  pinHost,
  unpinHost,
};
