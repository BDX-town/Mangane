# Updating Soapbox

You should always check the [release notes/changelog](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/CHANGELOG.md) in case there are deprecations, special update changes, etc.

Besides that, it's relatively pretty easy to update Soapbox FE. There's two ways to go about it: with the command line or with an unofficial script.

## Updating with the command line

To update Soapbox FE via the command line, do the following:

```
# Download the build.
curl -L https://gitlab.com/soapbox-pub/soapbox-fe/-/jobs/artifacts/v(latest.version.here)/download?job=build-production -o soapbox-fe.zip

# Remove all the current Soapbox FE build in Pleroma's instance directory.
rm -R /opt/pleroma/instance/static/packs
rm /opt/pleroma/instance/static/index.html
rm -R /opt/pleroma/instance/static/sounds

# Unzip the new build to Pleroma's instance directory.
busybox unzip soapbox-fe.zip -o -d /opt/pleroma/instance
```

## Updating with an unofficial script

You can also update Soapbox using [Sandia Mesa's updater bash script for Soapbox FE](https://code.sandiamesa.com/traboone/soapbox-update).

First, download the updater script if you haven't yet: ``sudo -Hu pleroma wget -P /var/lib/pleroma https://code.sandiamesa.com/traboone/soapbox-update/raw/branch/master/soapbox-update.sh -N``

Then, set the permissions of the updater script so that it can be executed: ``chmod u+x /var/lib/pleroma/soapbox-update.sh``

Finally, go to the Pleroma user's directory ``cd /var/lib/pleroma`` and then run ``sudo -Hu pleroma ./soapbox-update.sh``.

## After updating Soapbox

The changes take effect immediately, just refresh your browser tab. It's not necessary to restart the Pleroma service.
