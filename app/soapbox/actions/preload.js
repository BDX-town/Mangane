import { mapValues } from 'lodash';

export const PLEROMA_PRELOAD_IMPORT  = 'PLEROMA_PRELOAD_IMPORT';
export const MASTODON_PRELOAD_IMPORT = 'MASTODON_PRELOAD_IMPORT';

// https://git.pleroma.social/pleroma/pleroma-fe/-/merge_requests/1176/diffs
const decodeUTF8Base64 = data => {
  const rawData = atob(data);
  const array = Uint8Array.from(rawData.split('').map((char) => char.charCodeAt(0)));
  const text = new TextDecoder().decode(array);
  return text;
};

const decodePleromaData = data => {
  return mapValues(data, base64string => JSON.parse(decodeUTF8Base64(base64string)));
};

const pleromaDecoder = json => decodePleromaData(JSON.parse(json));

// This will throw if it fails.
// Should be called inside a try-catch.
const decodeFromMarkup = (elementId, decoder) => {
  const { textContent } = document.getElementById(elementId);
  return decoder(textContent);
};

function preloadFromMarkup(elementId, decoder, action) {
  return (dispatch, getState) => {
    try {
      const data = decodeFromMarkup(elementId, decoder);
      dispatch(action(data));
    } catch {
      // Do nothing
    }
  };
}

export function preload() {
  return (dispatch, getState) => {
    dispatch(preloadFromMarkup('initial-results', pleromaDecoder, preloadPleroma));
    dispatch(preloadFromMarkup('initial-state', JSON.parse, preloadMastodon));
  };
}

export function preloadPleroma(data) {
  return {
    type: PLEROMA_PRELOAD_IMPORT,
    data,
  };
}

export function preloadMastodon(data) {
  return {
    type: MASTODON_PRELOAD_IMPORT,
    data,
  };
}
