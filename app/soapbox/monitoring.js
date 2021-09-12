import { NODE_ENV, SENTRY_DSN } from 'soapbox/build_config';

export const start = () => {
  Promise.all([
    import(/* webpackChunkName: "error" */'@sentry/react'),
    import(/* webpackChunkName: "error" */'@sentry/tracing'),
  ]).then(([Sentry, { Integrations: Integrations }]) => {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: NODE_ENV,
      debug: false,
      integrations: [new Integrations.BrowserTracing()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });
  }).catch(console.error);
};

export const captureException = error => {
  import(/* webpackChunkName: "error" */'@sentry/react')
    .then(Sentry => {
      Sentry.captureException(error);
    })
    .catch(console.error);
};
