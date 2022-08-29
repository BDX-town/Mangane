import loadPolyfills from './soapbox/load_polyfills';

require('manifest.json');

// @ts-ignore
require.context('./images/', true);

// Load stylesheet
require('react-datepicker/dist/react-datepicker.css');
require('./styles/application.scss');

loadPolyfills().then(() => {
  require('./soapbox/main').default();
}).catch(e => {
  console.error(e);
});
