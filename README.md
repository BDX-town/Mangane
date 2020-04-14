# soapbox-fe

This is the frontend for [Soapbox](https://soapbox.pub).
It is based on [Gab Social](https://code.gab.com/gab/social/gab-social)'s frontend which is in turn based on [Mastodon](https://github.com/tootsuite/mastodon/)'s frontend.

# Running locally

To get it running, just clone the repo:

```
git clone https://gitlab.com/soapbox-pub/soapbox-fe.git
cd soapbox-fe
```

Ensure that Node.js and Yarn are installed, then install dependencies:

```
yarn
```

Finally, run the dev server:

```
yarn start
```

It will serve at `http://localhost:3036` by default.

It will proxy requests to the backend for you.
For Pleroma no other changes are required, just start Pleroma and it should begin working.

## Using with Mastodon

For Mastodon you will need to edit `webpack/development.js` and change the proxy port to 3000: `const backendUrl = 'http://localhost:3000';` then restart the soapbox-fe dev server.

Streaming will not work properly without extra effort.

Due to Mastodon not supporting authentication through the API, you will also need to authenticate manually.
First log in through the Mastodon interface, view the source of the page, and extract your access_token from the markup.
Then open soapbox-fe, open the console, and insert the following code:

```js
window.localStorage.setItem('soapbox:auth:user', JSON.stringify({access_token: "XXX"}));
```

Replace `XXX` with your access token.
Finally, refresh the page, and you should be logged in.

# Yarn Commands

The following commands are supported.

#### Local dev server
- `yarn start` - Run the local dev server. It will proxy requests to the backend for you.

- `yarn dev` - Exact same as above, aliased to `yarn start` for convenience.

#### Building
- `yarn build:development` - Build for development.

- `yarn build:production` - Build for production.

#### Translations
- `yarn manage:translations` - Normalizes translation files. Should always be run after editing i18n strings.

#### Tests
- `yarn test` - Runs all tests.

- `yarn test:lint` - Runs all linter tests.

- `yarn test:lint:js` - Runs only JavaScript linter.

- `yarn test:lint:sass` - Runs only SASS linter.

- `yarn test:jest` - Frontend unit tests.

# License

soapbox-fe is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

soapbox-fe is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with soapbox-fe.  If not, see <https://www.gnu.org/licenses/>.
