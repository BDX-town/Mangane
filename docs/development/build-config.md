# Build Configuration

Soapbox supports compile-time customizations in the form of environment variables and a gitignored `custom/` directory.

## `custom/` directory

You can place files into the `custom/` directory to customize the Soapbox build.

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
