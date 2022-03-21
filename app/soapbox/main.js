'use strict';

import './precheck';
// import * as OfflinePluginRuntime from '@lcdp/offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

// import { NODE_ENV } from 'soapbox/build_config';

import { default as Soapbox } from './containers/soapbox';
import * as monitoring from './monitoring';
import * as perf from './performance';
import ready from './ready';

function main() {
  perf.start('main()');

  // Sentry
  monitoring.start();

  ready(() => {
    const mountNode = document.getElementById('soapbox');

    ReactDOM.render(<Soapbox />, mountNode);

    // if (NODE_ENV === 'production') {
    //   // avoid offline in dev mode because it's harder to debug
    //   OfflinePluginRuntime.install();
    // }
    perf.stop('main()');
  });
}

export default main;
