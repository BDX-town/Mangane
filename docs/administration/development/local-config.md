# Local Dev Configuration

The following configuration variables are supported supported in local development.
Edit `.env` to set them.

All configuration is optional, except `NODE_ENV`.

## `NODE_ENV`

The Node environment.
Soapbox FE checks for the following options:

- `development` - What you should use while developing Soapbox FE.
- `production` - Use when compiling to deploy to a live server.
- `test` - Use when running automated tests.

## `BACKEND_URL`

URL to the backend server.
Can be http or https, and can include a port.
For https, be sure to also set `PROXY_HTTPS_INSECURE=true`.

**Default:** `http://localhost:4000`

## `PROXY_HTTPS_INSECURE`

Allows using an HTTPS backend if set to `true`.

This is needed if `BACKEND_URL` is set to an `https://` value.
[More info](https://stackoverflow.com/a/48624590/8811886).

**Default:** `false`
