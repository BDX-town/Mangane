// A mapping of unicode strings to an object containing the filename
// (i.e. the svg filename) and a shortCode intended to be shown
// as a "title" attribute in an HTML element (aka tooltip).

const [
  shortCodesToEmojiData,
  skins, // eslint-disable-line no-unused-vars
  categories, // eslint-disable-line no-unused-vars
  short_names, // eslint-disable-line no-unused-vars
  emojisWithoutShortCodes,
] = require('./emoji_compressed');
const { unicodeToFilename } = require('./unicode_to_filename');

// decompress
const unicodeMapping = {};

function processEmojiMapData(emojiMapData, shortCode) {
  const [ native, filename ] = emojiMapData;

  unicodeMapping[native] = {
    shortCode,
    filename: filename || unicodeToFilename(native),
  };
}

Object.keys(shortCodesToEmojiData).forEach((shortCode) => {
  const [ filenameData ] = shortCodesToEmojiData[shortCode];
  filenameData.forEach(emojiMapData => processEmojiMapData(emojiMapData, shortCode));
});
emojisWithoutShortCodes.forEach(emojiMapData => processEmojiMapData(emojiMapData));

module.exports = unicodeMapping;
