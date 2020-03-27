'use strict';

import loadPolyfills from '../gabsocial/load_polyfills';
import { start } from '../gabsocial/common';

start();

function loaded() {
  const ComposeContainer = require('../gabsocial/containers/compose_container').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('gabsocial-compose');

  if (mountNode !== null) {
    const props = JSON.parse(mountNode.getAttribute('data-props'));
    ReactDOM.render(<ComposeContainer {...props} />, mountNode);
  }
}

function main() {
  const ready = require('../gabsocial/ready').default;
  ready(loaded);
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
