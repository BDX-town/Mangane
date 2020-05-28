import loadPolyfills from '../soapbox/load_polyfills';
import { start } from '../soapbox/common';

start();

loadPolyfills().then(() => {
  require('../soapbox/main').default();
}).catch(e => {
  console.error(e);
});
