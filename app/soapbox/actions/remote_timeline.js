import { getSettings, changeSetting } from 'soapbox/actions/settings';

const getPinnedPosts = state => {
  const settings = getSettings(state);
  return settings.getIn(['remote_timeline', 'pinnedHosts']);
};

export function pinHost(host) {
  return (dispatch, getState) => {
    const state = getState();
    const pinnedHosts = getPinnedPosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(host)));
  };
}

export function unpinHost(host) {
  return (dispatch, getState) => {
    const state = getState();
    const pinnedHosts = getPinnedPosts(state);

    return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.delete(host)));
  };
}
