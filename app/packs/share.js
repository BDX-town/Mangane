'use strict';

import loadPolyfills from '../soapbox/load_polyfills';
import { start } from '../soapbox/common';

start();

function loaded() {
  const ComposeContainer = require('../soapbox/containers/compose_container').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('soapbox-compose');

  if (mountNode !== null) {
    const props = JSON.parse(mountNode.getAttribute('data-props'));
    ReactDOM.render(<ComposeContainer {...props} />, mountNode);
  }
}

function main() {
  const ready = require('../soapbox/ready').default;
  ready(loaded);
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
