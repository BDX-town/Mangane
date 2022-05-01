# Build Configuration

Soapbox supports compile-time customizations in the form of environment variables and a gitignored `custom/` directory.

## `custom/` directory

You can place files into the `custom/` directory to customize the Soapbox build.

### Custom snippets (`custom/snippets.html`)

If you'd like to include analytics snippets, custom meta tags, or anything else in the `<head>` of the document, you may do so by creating a `custom/snippets.html` file.

For example:

```html
<link href='/icons/icon-57x57.png' rel='apple-touch-icon' sizes='57x57'>
<link href='/icons/icon-64x64.png' rel='apple-touch-icon' sizes='64x64'>
<link href='/icons/icon-72x72.png' rel='apple-touch-icon' sizes='72x72'>
<link href='/icons/icon-114x114.png' rel='apple-touch-icon' sizes='114x114'>
<link href='/icons/icon-120x120.png' rel='apple-touch-icon' sizes='120x120'>
<link href='/icons/icon-180x180.png' rel='apple-touch-icon' sizes='180x180'>
<link href='/icons/icon-192x192.png' rel='apple-touch-icon' sizes='192x192'>
<link href='/icons/icon-512x512.png' rel='apple-touch-icon' sizes='512x512'>
<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//trk.bonsa.net/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '12345678']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
```

The snippet will be included **before** any Soapbox application code.

### Custom locales (`custom/locales/*.json`)

It is possible to override locale messages by creating a file for each language, eg `custom/locales/en.json`.
In this file, add only the messages you want to be overridden.

For example:

```json
{
  "account.posts": "Poasts",
  "account.posts_with_replies": "Poasts & Replies",
  "compose.submit_success": "Your poast was sent!",
  "compose_form.publish": "Poast"
}
```

These messages will be merged into the language file shipped with Soapbox.

### Feature overrides (`custom/features.json`)

You can create a file called `custom/features.json` to disable version-checking and force some features on or off.

For example:

```json
{
  "bookmarks": false,
  "lists": false,
  "quotePosts": true
}
```

See `app/soapbox/utils/features.js` for the full list of features.

### Embedded app (`custom/app.json`)

By default, Soapbox will create a new OAuth app every time a user tries to register or log in.
This is usually the desired behavior, as it works "out of the box" without any additional configuration, and it is resistant to tampering and subtle client bugs.
However, some larger servers may wish to skip this step for performance reasons.

If an app is supplied in `custom/app.json`, it will be used for authorization.
The full app entity must be provided, for example:

```json
{
  "client_id": "cf5yI6ffXH1UcDkEApEIrtHpwCi5Tv9xmju8IKdMAkE",
  "client_secret": "vHmSDpm6BJGUvR4_qWzmqWjfHcSYlZumxpFfohRwNNQ",
  "id": "7132",
  "name": "Soapbox FE",
  "redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
  "website": "https://soapbox.pub/",
  "vapid_key": "BLElLQVJVmY_e4F5JoYxI5jXiVOYNsJ9p-amkykc9NcI-jwa9T1Y2GIbDqbY-HqC6ayPkfW4K4o9vgBFKYmkuS4"
}
```

It is crucial that the app has the expected scopes.
You can obtain one with the following curl command (replace `MY_DOMAIN`):

```sh
curl -X POST -H "Content-Type: application/json" -d '{"client_name": "Soapbox FE", "redirect_uris": "urn:ietf:wg:oauth:2.0:oob", "scopes": "read write follow push admin", "website": "https://soapbox.pub/"}' "https://MY_DOMAIN.com/api/v1/apps"
```

### Custom files (`custom/instance/*`)

You can place arbitrary files of any type in the `custom/instance/` directory.
They will be available on your website at `https://example.com/instance/{filename}`.
Subdirectories are supported, too.

Some use cases:

- Logos, which can then be referenced from `soapbox.json`
- About pages, available at `/about` on your website.

## Environment variables

When compiling Soapbox FE, environment variables may be passed to change the build itself.
For example:

```sh
NODE_ENV="production" FE_BUILD_DIR="public" FE_SUBDIRECTORY="/soapbox" yarn build
```

### `NODE_ENV`

The environment to build Soapbox FE for.

Options:

- `"production"` - For live sites
- `"development"` - For local development
- `"test"` - Bootstraps test environment

Default: `"development"`

It's recommended to always build in `"production"` mode for live sites.

### `BACKEND_URL`

The base URL for API calls.
You only need to set this if Soapbox FE is hosted in a different place than the backend.

Options:

- An absolute URL, eg `"https://gleasonator.com"`
- Empty string (`""`)`

Default: `""`

### `FE_BUILD_DIR`

The folder to put build files in. This is mostly useful for CI tasks like GitLab Pages.

Options:

- Any directory name, eg `"public"`

Default: `"static"`

### `FE_SUBDIRECTORY`

Subdirectory to host Soapbox FE out of.
When hosting on a subdirectory, you must create a custom build for it.
This option will set the imports in `index.html`, and the basename for routes in React.

Options:

- Any path, eg `"/soapbox"` or `"/fe/soapbox"`

Default: `"/"`

For example, if you want to host the build on `https://gleasonator.com/soapbox`, you can compile it like this:

```sh
NODE_ENV="production" FE_SUBDIRECTORY="/soapbox" yarn build
```

### `SENTRY_DSN`

[Sentry](https://sentry.io/) endpoint for this custom build.

Sentry is an error monitoring service that may be optionally included.
When an endpoint is not configured, it does nothing.

Sentry's backend was FOSS until 2019 when it moved to source-available, but a BSD-3 fork called [GlitchTip](https://glitchtip.com/) may also be used.

Options:

- Endpoint URL, eg `"https://abcdefg@app.glitchtip.com/123"`

Default: `""`
