# Install Mangane with Yunohost

If you use **Yunohost** selfhosting system (based on Debian GNU/Linux), and run an Akkoma or Pleroma instance, you can install Mangane, but instructions are quite different.

Yunohost Package code repositories:

- [Akkoma YNH](https://github.com/YunoHost-Apps/akkoma_ynh)
- [Pleroma YNH](https://github.com/YunoHost-Apps/pleroma_ynh)

## Yunohost App Package

Some information, for all intents and purposes, on the differences between a direct installation of Akkoma or Pleroma (from the _releases_) and installation with the Yunohost application package.

**Akkoma**

|                             | Official Package           | With Yunohost                            |
| --------------------------- | -------------------------- | ---------------------------------------- |
| Install directory           | `/opt/akkoma`              | `/var/www/akkoma/live/`                  |
| Static directory            | `/var/lib/akkoma/static`   | `/etc/akkoma/config.exs`                 |
| Configuration file          | `/etc/akkoma/config.exs`   | `/etc/akkoma/config.exs`                 |
| Command line path           | `/bin/pleroma_ctl`         | `/var/www/akkoma/live/bin/pleroma_ctl`   |


**Pleroma**

|                             | Official Package           | With Yunohost                            |
| --------------------------- | -------------------------- | ---------------------------------------- |
| Install directory           | `/opt/pleroma`             | `/var/www/pleroma/live/`                 |
| Static directory            | `/var/lib/pleroma/static`  | `/etc/pleroma/config.exs`                |
| Configuration file          | `/etc/pleroma/config.exs`  | `/etc/pleroma/config.exs`                |
| Command line path           | `/bin/pleroma_ctl`         | `/var/www/pleroma/live/bin/pleroma_ctl`  |

**Things to remember:**

- The installation of Akkoma or Pleroma with Yunohost is a so-called OTP installation (and not MIX, i.e. from the sources). Have this in mind, as the administration commands are not the same in either case.
- Akkoma is a _fork_ of Pleroma, so the administration command is indeed `pleroma_ctl` (this is not a typo).

## Install Mangane with the CLI

**For Akkoma**

```
su pleroma -s $SHELL -lc "/var/www/akkoma/live/bin/pleroma_ctl frontend install mangane --ref dist --build-url https://github.com/BDX-town/Mangane/releases/latest/download/static.zip"
```

**For Pleroma**

```
su pleroma -s $SHELL -lc "/var/www/pleroma/live/bin/pleroma_ctl frontend install mangane --ref dist --build-url https://github.com/BDX-town/Mangane/releases/latest/download/static.zip"
```
It’s done!

**Upgrade**

To upgrade Mangane, run the install commands again, on top of actual version.

