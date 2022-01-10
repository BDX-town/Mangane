'use strict';

import './precheck';
import React from 'react';
import ReactDOM from 'react-dom';
import * as OfflinePluginRuntime from '@lcdp/offline-plugin/runtime';
import { NODE_ENV } from 'soapbox/build_config';
import { default as Soapbox } from './containers/soapbox';
import * as perf from './performance';
import * as monitoring from './monitoring';
import ready from './ready';

function main() {
  perf.start('main()');

  // Sentry
  monitoring.start();

  ready(() => {
    const mountNode = document.getElementById('soapbox');

    ReactDOM.render(<Soapbox />, mountNode);

    if (NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      OfflinePluginRuntime.install();
    }
    perf.stop('main()');
  });
}

export default main;
