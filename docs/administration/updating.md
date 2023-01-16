# Updating Mangane

You should always check the [release notes](https://github.com/BDX-town/Mangane/releases) in case there are deprecations, special update changes, etc.

Besides that, it's relatively pretty easy to update Mangane with the command line.

## Updating with the command line

Login with SSH to your server:

```sh
/opt/pleroma/bin/pleroma_ctl frontend install mangane --ref dist --build-url https://github.com/BDX-town/Mangane/releases/latest/download/static.zip
```

## After updating Mangane

The changes take effect immediately, just refresh your browser tab. It’s not necessary to restart the Pleroma service.
