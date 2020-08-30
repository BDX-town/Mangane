# How it works

Soapbox FE is a [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) that runs entirely in the browser with JavaScript.

It has a single HTML file, `index.html`, responsible only for loading the required JavaScript and CSS.
It interacts with the backend through [XMLHttpRequest (XHR)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).

It incorporates much of the [Mastodon API](https://docs.joinmastodon.org/methods/) used by Pleroma and Mastodon, but requires many [Pleroma-specific features](https://docs-develop.pleroma.social/backend/API/differences_in_mastoapi_responses/) in order to function.
