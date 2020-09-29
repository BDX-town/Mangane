import loadPolyfills from './soapbox/load_polyfills';

require('fork-awesome/css/fork-awesome.css');

require.context('./images/', true);

require('@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css');
require('@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css');

loadPolyfills().then(() => {
  require('./soapbox/main').default();
}).catch(e => {
  console.error(e);
});
