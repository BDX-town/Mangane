# Developing a backend

Soapbox expects backends to implement the [Mastodon API](https://docs.joinmastodon.org/methods/).

At the very least:

- [instance](https://docs.joinmastodon.org/methods/instance/)
- [apps](https://docs.joinmastodon.org/methods/apps/)
- [oauth](https://docs.joinmastodon.org/methods/apps/oauth/)
- [accounts](https://docs.joinmastodon.org/methods/accounts/)
- [statuses](https://docs.joinmastodon.org/methods/statuses/)

Soapbox uses feature-detection on the instance to determine which features to show.
By default, a minimal featureset is used.

## Feature detection

First thing, Soapbox fetches GET `/api/v1/instance` to identify the backend.
The instance should respond with a `version` string:

```js
{
  "title": "Soapbox",
  "short_description": "hello world!",
  // ...
  "version": "2.7.2 (compatible; Pleroma 2.4.52+soapbox)"
}
```

The version string should match this format:

```
COMPAT_VERSION (compatible; BACKEND_NAME VERSION)
```

The Regex used to parse it:

```js
/^([\w+.]*)(?: \(compatible; ([\w]*) (.*)\))?$/
```

- `COMPAT_VERSION` - The highest Mastodon API version this backend is compatible with. If you're not sure, use a lower version like `2.7.2`. It MUST follow [semver](https://semver.org/).
- `BACKEND_NAME` - Human-readable name of the backend. No spaces!
- `VERSION` - The actual version of the backend. It MUST follow [semver](https://semver.org/).

Typically checks are done against `BACKEND_NAME` and `VERSION`.

The version string is similar in purpose to a [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) string.
The format was first invented by Pleroma, but is now widely used, including by Pixelfed, Mitra, and Soapbox BE.

See [`features.ts`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/app/soapbox/utils/features.ts) for the complete list of features.

## Forks of other software

If your software is a fork of another software, the version string should indicate that.
Otherwise, Soapbox will use the minimal featureset.

### Forks of Mastodon

Mastodon forks do not need the compat section, and can simply append `+[NAME]` to the version string (eg Glitch Social):

```
3.2.0+glitch
```

### Forks of Pleroma

For Pleroma forks, the fork name should be in the compat section (eg Soapbox BE):

```
2.7.2 (compatible; Pleroma 2.4.52+soapbox)
```

## Adding support for a new backend

If the backend conforms to the above format, please modify [`features.ts`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/app/soapbox/utils/features.ts) and submit a merge request to enable features for your backend!
