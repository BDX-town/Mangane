import { danger, warn, message } from 'danger';

const docs = danger.git.fileMatch('docs/**/*.md');
const app = danger.git.fileMatch('app/**/*.(js|ts|tsx)');
const tests = danger.git.fileMatch('**/__tests__/**');

if (docs.edited) {
  message('Thanks - We :heart: our [documentarians](http://www.writethedocs.org/)!');
}

if (app.modified && !tests.modified) {
  warn('You have app changes without tests.');
}
