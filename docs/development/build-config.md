# Build Configuration

When compiling Soapbox FE, environment variables may be passed to change the build itself.
For example:

```sh
NODE_ENV="production" FE_BUILD_DIR="public" FE_BASE_PATH="/soapbox" yarn build
```

The following build variables are available:

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

- A relative URL, eg `"/"`
- An absolute URL, eg `"https://gleasonator.com"`

Default: `"/"`

### `FE_BUILD_DIR`

The folder to put build files in. This is mostly useful for CI tasks like GitLab Pages.

Options:

- Any directory name, eg `"public"`

Default: `"static"`

### `FE_BASE_PATH`

Subdirectory to host Soapbox FE out of.
When hosting on a subdirectory, you must create a custom build for it.
This option will set the imports in `index.html`, and the basename for routes in React.

Options:

- Any path, eg `"/soapbox"` or `"/fe/soapbox"`

Default: `"/"`

For example, if you want to host the build on `https://gleasonator.com/soapbox`, you can compile it like this:

```sh
NODE_ENV="production" FE_BASE_PATH="/soapbox" yarn build
```
