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

It will proxy requests to the backend for you.
For Pleroma running on `localhost:4000` (the default) no other changes are required, just start a local Pleroma server and it should begin working.

## Troubleshooting: `ERROR: NODE_ENV must be set`

Create a `.env` file if you haven't already.

```
cp .env.example .env
```

And ensure that it contains `NODE_ENV=development`.
Try again.
