'use strict';

const element = document.getElementById('initial-state');
const initialState = element && JSON.parse(element.textContent);

const getMeta = (prop) => initialState && initialState.meta && initialState.meta[prop];

export const reduceMotion = getMeta('reduce_motion');
export const displayMedia = getMeta('display_media');
export const unfollowModal = getMeta('unfollow_modal');
export const boostModal = getMeta('boost_modal');
export const deleteModal = getMeta('delete_modal');
export const searchEnabled = getMeta('search_enabled');
export const invitesEnabled = getMeta('invites_enabled');
export const profile_directory = getMeta('profile_directory');
export const isStaff = getMeta('is_staff');
export const unreadCount = getMeta('unread_count');

export default initialState;
