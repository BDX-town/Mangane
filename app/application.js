import loadPolyfills from './soapbox/load_polyfills';

require('fork-awesome/css/fork-awesome.css');

require.context('./images/', true);

loadPolyfills().then(() => {
  require('./soapbox/main').default();
}).catch(e => {
  console.error(e);
});
