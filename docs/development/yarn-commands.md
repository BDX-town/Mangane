# Yarn Commands

The following commands are supported.
You must set `NODE_ENV` to use these commands.
To do so, you can add the following line to your `.env` file:

```
NODE_ENV=development
```

## Local dev server
- `yarn dev` - Run the local dev server.

## Building
- `yarn build` - Compile without a dev server, into `/static` directory.

## Translations
- `yarn manage:translations` - Normalizes translation files. Should always be run after editing i18n strings.

## Tests
- `yarn test` - Runs all tests.

- `yarn test:lint` - Runs all linter tests.

- `yarn test:lint:js` - Runs only JavaScript linter.

- `yarn test:lint:sass` - Runs only SASS linter.

- `yarn test:jest` - Frontend unit tests.
