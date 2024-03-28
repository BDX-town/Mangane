'use strict';

import './precheck';
import * as OfflinePluginRuntime from '@lcdp/offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';
import { setSwUpdating } from 'soapbox/actions/sw';
import * as BuildConfig from 'soapbox/build_config';
import { store } from 'soapbox/store';
import { printConsoleWarning } from 'soapbox/utils/console';

import { default as Soapbox } from './containers/soapbox';
import * as perf from './performance';
import ready from './ready';

const messages = defineMessages({
  update: { id: 'sw.update', defaultMessage: 'Update' },
  updateText: { id: 'sw.update_text', defaultMessage: 'An update is available.' },
});

function main() {
  perf.start('main()');

  // Print console warning
  if (BuildConfig.NODE_ENV === 'production') {
    printConsoleWarning();
  }

  ready(() => {
    const mountNode = document.getElementById('soapbox') as HTMLElement;

    ReactDOM.render(<Soapbox />, mountNode);

    if (BuildConfig.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      // https://github.com/NekR/offline-plugin/pull/201#issuecomment-285133572
      OfflinePluginRuntime.install({
        onUpdateReady: function() {
          store.dispatch(snackbar.show('info', messages.updateText, {
            actionLabel: messages.update,
            action: () => {
              store.dispatch(setSwUpdating(true));
              OfflinePluginRuntime.applyUpdate();
            },
            dismissAfter: false,
          }));
        },
        onUpdated: function() {
          window.location.reload();
        },
      });
    }
    perf.stop('main()');
  });
}

export default main;
