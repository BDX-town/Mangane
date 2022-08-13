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
yarn dev
```

**That's it!** 🎉

It will serve at `http://localhost:3036` by default.

You should see an input box - just enter the domain name of your instance to log in.

Tip: you can even enter a local instance like `http://localhost:3000`!

## Troubleshooting: `ERROR: NODE_ENV must be set`

Create a `.env` file if you haven't already.

```sh
cp .env.example .env
```

And ensure that it contains `NODE_ENV=development`.
Try again.

## Troubleshooting: it's not working!

Run `node -V` and compare your Node.js version with the version in [`.tool-versions`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/.tool-versions).
If they don't match, try installing [asdf](https://asdf-vm.com/).
