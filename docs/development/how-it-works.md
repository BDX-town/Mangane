# How it works

Soapbox FE is a [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) that runs entirely in the browser with JavaScript.

It has a single HTML file, `index.html`, responsible only for loading the required JavaScript and CSS.
It interacts with the backend through [XMLHttpRequest (XHR)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).

Here is a simplified example with Nginx:

```nginx
location /api {
  proxy_pass http://backend;
}

location / {
  root /opt/soapbox;
  try_files $uri index.html;
}
```

(See [`mastodon.conf`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/installation/mastodon.conf) for a full example.)

Soapbox incorporates much of the [Mastodon API](https://docs.joinmastodon.org/methods/), [Pleroma API](https://api.pleroma.social/), and more.
It detects features supported by the backend to provide the right experience for the backend.
