# Install Mangane on Yunohost

If you use **Yunohost** selfhosting system (based on Debian GNU/Linux), and run an Akkoma or Pleroma instance, you can install Mangane, but instructions are quite different.

Yunohost Package code repositories:

- [Akkoma YNH](https://github.com/YunoHost-Apps/akkoma_ynh)
- [Pleroma YNH](https://github.com/YunoHost-Apps/pleroma_ynh)

Note than, at time of writing this document (january 2023) the Akkoma package is in very _early stage_ of devlopement.

## Yunohost App Package

Some information, for all intents and purposes, on the differences between a direct installation of Akkoma or Pleroma (from the _releases_) and installation with the Yunohost application package.

#### Akkoma

|                             | Official Package           | With Yunohost                            |
| --------------------------- | -------------------------- | ---------------------------------------- |
| Install directory           | `/opt/akkoma`              | `/var/www/akkoma/live/`                  |
| Static directory            | `/var/lib/akkoma/static`   | `/etc/akkoma/config.exs`                 |
| Configuration file          | `/etc/akkoma/config.exs`   | `/etc/akkoma/config.exs`                 |
| Command line path           | `/bin/pleroma_ctl`         | `/var/www/akkoma/live/bin/pleroma_ctl`   |


#### Pleroma

|                             | Official Package           | With Yunohost                            |
| --------------------------- | -------------------------- | ---------------------------------------- |
| Install directory           | `/opt/pleroma`             | `/var/www/pleroma/live/`                 |
| Static directory            | `/var/lib/pleroma/static`  | `/etc/pleroma/config.exs`                |
| Configuration file          | `/etc/pleroma/config.exs`  | `/etc/pleroma/config.exs`                |
| Command line path           | `/bin/pleroma_ctl`         | `/var/www/pleroma/live/bin/pleroma_ctl`  |

**Some things to remember:**

- Akkoma is a _fork_ of Pleroma, so the administration CLI utility is indeed `pleroma_ctl` (this is not a typo).
- The installation of Akkoma or Pleroma with Yunohost is a so-called OTP installation (and not MIX, i.e. from the sources). Have this in mind, as the administration commands are not the same in either case.
- When you run commands for Pleroma/Akkoma you must login with SSH as Yunohost `admin` user, and switch to root with `sudo` before executing the command (see instruction below).

## Install Mangane with the CLI

#### For Akkoma

Important: with Akkoma YNH package Mangane is _pre-installed_, but not activated as default frontend interface. 
So you don’t need to run the CLI install command the first time, only later for version upgrade.

You have just to activate Mangane as default frontend.  

You can edit your configuration files to add/edit the `config :pleroma, :frontends` section.

Login with SSH to your server as Yunohost `admin` user and exec this command:

```
config :pleroma, :frontends,
  primary: %{
    "name" => "mangane",
    "ref" => "dist"
  }
```
Then run this command to synchronize the configuration in the database:

```
sudo su pleroma -s $SHELL -lc "/var/www/akkoma/live/bin/pleroma_ctl config migrate_to_db"
```
You can also use the Admin interface to do this (see [README](https://github.com/BDX-town/Mangane#admin-fe-with-database-configuration-enabled)) if you are not confortable with the command line.

#### For Pleroma

Login with SSH to your server as Yunohost `admin` user and exec this command:

```
sudo su pleroma -s $SHELL -lc "/var/www/pleroma/live/bin/pleroma_ctl frontend install mangane --ref dist --build-url https://github.com/BDX-town/Mangane/releases/latest/download/static.zip"
```
It’s done!

You can also use the Admin interface to do this (see the `README` file for [installation](https://github.com/BDX-town/Mangane#with-admin-fe) and [acttivation](https://github.com/BDX-town/Mangane#admin-fe-with-database-configuration-enabled)) if you are not confortable with the command line.


#### Upgrade

To upgrade Mangane, you only have to run the _install command_ again on top of actual version. Normaly _no need_ to reload Pleroma or Akkoma.

For Akkoma, login with SSH to your server as Yunohost `admin` user and exec this command:

```
sudo su akkoma -s $SHELL -lc "/var/www/akkoma/live/bin/pleroma_ctl frontend install mangane --ref dist --build-url https://github.com/BDX-town/Mangane/releases/latest/download/static.zip"
```
For Akkoma or Pleroma, you can also use the Admin interface to do this (see [README](https://github.com/BDX-town/Mangane#with-admin-fe)) if you are not confortable with the command line.

