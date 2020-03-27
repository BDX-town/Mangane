import loadPolyfills from '../gabsocial/load_polyfills';
import { start } from '../gabsocial/common';

start();

loadPolyfills().then(() => {
  require('../gabsocial/main').default();
}).catch(e => {
  console.error(e);
});
