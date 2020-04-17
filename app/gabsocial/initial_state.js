'use strict';

const element = document.getElementById('initial-state');
const initialState = element && JSON.parse(element.textContent);

const getMeta = (prop) => initialState && initialState.meta && initialState.meta[prop];

export const reduceMotion = getMeta('reduce_motion');
export const autoPlayGif = getMeta('auto_play_gif');
export const displayMedia = getMeta('display_media');
export const unfollowModal = getMeta('unfollow_modal');
export const boostModal = getMeta('boost_modal');
export const deleteModal = getMeta('delete_modal');
export const me = getMeta('me');
export const meUsername = getMeta('username');
export const searchEnabled = getMeta('search_enabled');
export const invitesEnabled = getMeta('invites_enabled');
export const repository = getMeta('repository');
export const source_url = getMeta('source_url');
export const version = getMeta('version');
export const logo = getMeta('logo');
export const mascot = getMeta('mascot');
export const siteTitle = getMeta('site_title');
export const profile_directory = getMeta('profile_directory');
export const isStaff = getMeta('is_staff');
export const forceSingleColumn = !getMeta('advanced_layout');
export const funding = getMeta('funding');
export const promoItems = getMeta('promo_items');
export const unreadCount = getMeta('unread_count');
export const maxTootChars = getMeta('max_toot_chars');

export default initialState;
