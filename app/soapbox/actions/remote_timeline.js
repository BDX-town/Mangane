import { getSettings, changeSetting } from 'soapbox/actions/settings';

const getPinnedHosts = state => {
  const settings = getSettings(state);
  return settings.getIn(['remote_timeline', 'pinnedHosts']);
};

export function pinHost(host) {
  return (dispatch, getState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(host)));
  };
}

export function unpinHost(host) {
  return (dispatch, getState) => {
    const state = getState();
    const pinnedHosts = getPinnedHosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.delete(host)));
  };
}
