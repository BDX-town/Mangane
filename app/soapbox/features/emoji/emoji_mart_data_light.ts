// The output of this module is designed to mimic emoji-mart's
// "data" object, such that we can use it for a light version of emoji-mart's
// emojiIndex.search functionality.
import emojiCompressed from './emoji_compressed';
import { unicodeToUnifiedName } from './unicode_to_unified_name';

const [ shortCodesToEmojiData, skins, categories, short_names ] = emojiCompressed;

const emojis: Record<string, any> = {};

// decompress
Object.keys(shortCodesToEmojiData).forEach((shortCode) => {
  const [
    _filenameData, // eslint-disable-line @typescript-eslint/no-unused-vars
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

export {
  emojis,
  skins,
  categories,
  short_names,
};

export default {
  emojis,
  skins,
  categories,
  short_names,
};
