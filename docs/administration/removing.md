# Removing Soapbox

Removing Soapbox FE and reverting to Pleroma FE is really easy. Just run the following:
```
rm /opt/pleroma/instance/static/index.html
rm -R /opt/pleroma/instance/static/packs
rm -R /opt/pleroma/instance/static/sounds
```

If you need to remove other stuff, feel free to do so. But be careful not to remove your own HTML files.
