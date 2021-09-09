import { parseVersion } from './features';

// For solving bugs between API implementations
export const getQuirks = instance => {
  const v = parseVersion(instance.get('version'));
  return {
    invertedPagination: v.software === 'Pleroma',
  };
};

export const getNextLinkName = getState =>
  getQuirks(getState().get('instance')).invertedPagination ? 'prev' : 'next';
