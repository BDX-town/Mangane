import { createSelector } from 'reselect';

import { parseVersion, PLEROMA, MITRA } from './features';

// For solving bugs between API implementations
export const getQuirks = createSelector([
  instance => parseVersion(instance.get('version')),
], (v) => {
  return {
    invertedPagination: v.software === PLEROMA,
    noApps: v.software === MITRA,
    noOAuthForm: v.software === MITRA,
  };
});

export const getNextLinkName = getState =>
  getQuirks(getState().get('instance')).invertedPagination ? 'prev' : 'next';
