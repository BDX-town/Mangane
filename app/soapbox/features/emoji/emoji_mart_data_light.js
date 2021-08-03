// The output of this module is designed to mimic emoji-mart's
// "data" object, such that we can use it for a light version of emoji-mart's
// emojiIndex.search functionality.
const { unicodeToUnifiedName } = require('./unicode_to_unified_name');
const [ shortCodesToEmojiData, skins, categories, short_names ] = require('./emoji_compressed');

const emojis = {};

// decompress
Object.keys(shortCodesToEmojiData).forEach((shortCode) => {
  const [
    filenameData, // eslint-disable-line no-unused-vars
    searchData,
  ] = shortCodesToEmojiData[shortCode];
  const [
    native,
    short_names,
    search,
    unified,
  ] = searchData;

  emojis[shortCode] = {
    native,
    search,
    short_names: [shortCode].concat(short_names),
    unified: unified || unicodeToUnifiedName(native),
  };
});

module.exports = {
  emojis,
  skins,
  categories,
  short_names,
};
