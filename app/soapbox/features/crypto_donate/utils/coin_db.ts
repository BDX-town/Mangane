import { fromJS } from 'immutable';

import manifestMap from './manifest_map';

// All this does is converts the result from manifest_map.js into an ImmutableMap
const coinDB = fromJS(manifestMap);
export default coinDB;

/** Get title from CoinDB based on ticker symbol */
export const getTitle = (ticker: string): string => {
  const title = coinDB.getIn([ticker, 'name']);
  return typeof title === 'string' ? title : '';
};
