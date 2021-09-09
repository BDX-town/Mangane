// @preval
// Converts cryptocurrency-icon's manifest file from a list to a map.
// See: https://github.com/spothq/cryptocurrency-icons/blob/master/manifest.json

const manifest = require('cryptocurrency-icons/manifest.json');
const { Map: ImmutableMap, fromJS } = require('immutable');

const manifestMap = fromJS(manifest).reduce((acc, entry) => {
  return acc.set(entry.get('symbol').toLowerCase(), entry);
}, ImmutableMap());

module.exports = manifestMap.toJS();
