import { fromJS } from 'immutable';
import manifestMap from './manifest_map';

// All this does is converts the result from manifest_map.js into an ImmutableMap
const coinDB = fromJS(manifestMap);
export default coinDB;
