import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { NODE_ENV, SENTRY_DSN } from 'soapbox/build_config';

export function start() {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    debug: false,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}
