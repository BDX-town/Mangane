import loadPolyfills from './soapbox/load_polyfills';
import { installDiagnosticConsolePolicy } from './soapbox/utils/diagnostics';
import { applyIOSPWAFixes } from './soapbox/utils/pwa';

installDiagnosticConsolePolicy();

// Apply iOS PWA compatibility fixes early (before React mounts)
applyIOSPWAFixes();

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
