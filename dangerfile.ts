import { danger, warn, message } from 'danger';

// Docs changes
const docs = danger.git.fileMatch('docs/**/*.md');

if (docs.edited) {
  message('Thanks - We :heart: our [documentarians](http://www.writethedocs.org/)!');
}

// UI components
const uiCode = danger.git.fileMatch('app/soapbox/components/ui/**');
const uiTests = danger.git.fileMatch('app/soapbox/components/ui/**/__tests__/**');

if (uiCode.edited && !uiTests.edited) {
  warn('You have UI changes (`soapbox/components/ui`) without tests.');
}

// Actions
const actionsCode = danger.git.fileMatch('app/soapbox/actions/**');
const actionsTests = danger.git.fileMatch('app/soapbox/actions/**__tests__/**');

if (actionsCode.edited && !actionsTests.edited) {
  warn('You have actions changes (`soapbox/actions`) without tests.');
}

// Reducers
const reducersCode = danger.git.fileMatch('app/soapbox/reducers/**');
const reducersTests = danger.git.fileMatch('app/soapbox/reducers/**__tests__/**');

if (reducersCode.edited && !reducersTests.edited) {
  warn('You have reducer changes (`soapbox/reducers`) without tests.');
}
