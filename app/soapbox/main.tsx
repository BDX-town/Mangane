'use strict';

import './precheck';
import * as OfflinePluginRuntime from '@lcdp/offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import * as BuildConfig from 'soapbox/build_config';
import { printConsoleWarning } from 'soapbox/utils/console';

import { default as Soapbox } from './containers/soapbox';
import * as monitoring from './monitoring';
import * as perf from './performance';
import ready from './ready';

function main() {
  perf.start('main()');

  // Sentry
  monitoring.start();

  // Print console warning
  if (BuildConfig.NODE_ENV === 'production') {
    printConsoleWarning();
  }

  ready(() => {
    const mountNode = document.getElementById('soapbox') as HTMLElement;

    ReactDOM.render(<Soapbox />, mountNode);

    if (BuildConfig.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      OfflinePluginRuntime.install();
    }
    perf.stop('main()');
  });
}

export default main;
