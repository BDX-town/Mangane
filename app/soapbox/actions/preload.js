import { mapValues } from 'lodash';

export const PRELOAD_IMPORT = 'PRELOAD_IMPORT';

// https://git.pleroma.social/pleroma/pleroma-fe/-/merge_requests/1176/diffs
const decodeUTF8Base64 = (data) => {
  const rawData = atob(data);
  const array = Uint8Array.from(rawData.split('').map((char) => char.charCodeAt(0)));
  const text = new TextDecoder().decode(array);
  return text;
};

const decodeData = data =>
  mapValues(data, base64string =>
    JSON.parse(decodeUTF8Base64(base64string)));

export function preload() {
  const element = document.getElementById('initial-results');
  const data = element ? JSON.parse(element.textContent) : {};

  return {
    type: PRELOAD_IMPORT,
    data: decodeData(data),
  };
}
