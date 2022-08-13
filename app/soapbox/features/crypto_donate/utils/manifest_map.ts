// Converts cryptocurrency-icon's manifest file from a list to a map.
// See: https://github.com/spothq/cryptocurrency-icons/blob/master/manifest.json

import manifest from 'cryptocurrency-icons/manifest.json';
import { List as ImmutableList, Map as ImmutableMap, fromJS } from 'immutable';

const manifestMap = (fromJS(manifest) as ImmutableList<ImmutableMap<string, string>>).reduce((acc: ImmutableMap<string, ImmutableMap<string, string>>, entry: ImmutableMap<string, string>) => {
  return acc.set(entry.get('symbol')!.toLowerCase(), entry);
}, ImmutableMap());

export default manifestMap.toJS();
