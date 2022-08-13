# Deploying Soapbox at scale

Fortunately Soapbox is just static files!
HTML, CSS, and JS is as scalable as it gets, but there are some additional considerations when deploying at scale.

This guide is intended for users with a lot of traffic, who need to serve Soapbox behind a load-balancer.

## Getting or building Soapbox

The best way to get Soapbox builds is from a GitLab CI job.
The official build URL is here:

```
https://gitlab.com/soapbox-pub/soapbox-fe/-/jobs/artifacts/develop/download?job=build-production
```

(Note that `develop` in that URL can be replaced with any git ref, eg `v2.0.0`, and thus will be updated with the latest zip whenever a new commit is pushed to `develop`.)

### Producing a custom build

If you'd like to customize Soapbox, we recommend forking it on GitLab and having GitLab CI produce the build for you at your own URL.

You may be interested in [build configuration options](../development/build-config) for customization and compile-time options.

## Load-balanced Nginx

A common way to deploy Soapbox at scale is with multiple Nginx servers behind a load-balancer.
The load-balancer could run HAProxy, be a Cloudflare load-balancer, or even be another Nginx.

Each Nginx should have the latest Soapbox deployed on it, while the load-balancer distributes traffic to each Nginx.

Soapbox is an [SPA (single-page application)](https://en.wikipedia.org/wiki/Single-page_application), meaning Nginx should serve the same `index.html` for every route except build files and known API paths.

Loosely, that can be achieved like this:

```nginx
location / {
  root /opt/soapbox/static;
  try_files $uri index.html;
}

location ~ ^/(api|oauth|admin) {
  proxy_pass http://127.0.0.1:3000;
}
```

We recommend trying [`mastodon.conf`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/installation/mastodon.conf) as a starting point.
It is fine-tuned, includes support for federation, and should work with any backend.

## The ServiceWorker

Soapbox ships with a ServiceWorker, `sw.js`, as part of its build.

ServiceWorkers enable native app-like functionality on the site, including:

- Offline support.
- Native push notifications.
- "Add to home screen" prompt.

Overall, the ServiceWorker offers a better experience for users.
However it requires careful planning for deployments, because it has an unprecedented level of control over the browser.

Here are some surprising things ServiceWorkers can do:

- Serve a different page for any URL on the domain, even if no such file/page has been deployed.
- Serve an outdated file even after clearing your browser cache.

To help mitigate ServiceWorker issues, it's important to follow the directions in this guide regarding the order of files deployed and caching.

It is also possible to omit `sw.js` from your deployment if you aren't ready for it, but beware that simply removing the file won't cause the ServiceWorker to disappear from users' devices.
You should deploy a [no-op ServiceWorker](https://developer.chrome.com/docs/workbox/remove-buggy-service-workers/) for that.

## Deploying files in order

Soapbox files depend on one-another, so it's important they're deployed in the following order:

1. `packs/` is deployed to _all servers_ first.
2. `index.html` is deployed to _all servers_ next.
3. `sw.js` (and everything else) is deployed to _all servers_ last.

_"All servers"_ is stressed because with a load-balanced deployment, it's important to wait between each step so things don't get out of sync.

Files in `packs/` are generated with [contenthash filenames](https://webpack.js.org/guides/caching/#output-filenames), so a new deployment won't interfere with the running deployment.
It is safe to merge directories with "overwrite" or "skip" mode.

The `index.html` contains hardcoded paths to files in `packs/`, so it must be deployed after all `packs/` have been uploaded.
New index files will overwrite the existing one on each server.

Finally, `sw.js` should be deployed, overwriting the existing one on each server.
It is dependent on `index.html`, and if deployed too soon, the ServiceWorker could cache an outdated `index.html` leaving users stuck on an old version of your website.

## Cache considerations

Build files in `packs/` have [unique filenames](https://webpack.js.org/guides/caching/#output-filenames) based on their content.
They are considered **idempotent** and may be cached forever.
You could even consider deploying these to an S3-compatible CDN.

However, **all other files else should not be cached at all**.

Please ensure that your Nginx configuration does not return `cache-control` headers on the index of your website (or any other page that serves Soapbox), and you _must not enable edge caching_ in Nginx or third-party services like Cloudflare.

Furthermore, `sw.js` must not be cached at the edge.

Failure to do this could lead to improper ServiceWorker functioning upon new deployments, leaving users stuck on a malfunctioning version of the site.

## Server Side Rendering (SSR)

AKA "why don't links to my website show a preview when posted on Facebook/Twitter/Slack/etc"?

Deploying with Nginx means that you forego the link preview functionality offered by Pleroma and Mastodon, since Soapbox has no knowledge of the backend whatsoever.

Our official solution is [Soapbox Worker](https://gitlab.com/soapbox-pub/soapbox-worker), a Cloudflare Worker that intercepts the reqest/response and injects metadata into the page by querying the API behind the scenes.
