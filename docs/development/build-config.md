# Build Configuration

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
