# Customizing Mangane

Mangane uses your own site’s name and branding throughout the interface.
This allows every instance to be different, and catered to a particular audience.

## Instance settings

Some settings must be configured in Pleroma or Akoma itself. 
On Pleroma or Akkoma, you can configure the instance through AdminFE graphic interface, or by editing `config/prod.secret.exs` file on the server.

Some options you may want to customize from the begining:

- Site’s name and short description.
- Define a default profile header image.
- Change the default user avatar.

These are settings global to your website, and will also affect mobile apps and other frontends accessing your website.

These settings are also exposed through the API under GET `/api/v1/instance`.

## Mangane settings

Most settings are specific to your installation and not the entire website.
That includes the logo, default theme, various navigation entries, and more.

Admins can edit these settings directly from frontend. Just click “Mangane config” in the sidebar, or navigate directly to `https://yourinstance.tld/soapbox/config`.

These settings are exposed through the Pleroma or Akkoma API under GET `/api/pleroma/frontend_configurations`.
Otherwise, the settings need to be uploaded manually and made available at GET `/instance/soapbox.json`.

### The instance logo

The instance logo must be a valid svg file. It will be shown in pages using the same icon system than the rest of the app, in order to match the colors settings. Be sure to use a 'raw' svg file, and to not simply use a svg wrapper for a bitmap image. 

If you want the logo to match your color settings, you will need to update it so every `fill` or `stroke` property that you want to change use the special value `currentColor` (see: https://css-tricks.com/currentcolor/)

## Static pages

It is possible to create arbitrary HTML pages under `/about/:page` on your website.

In your Mangane installation directory, find the `instance` folder.
For Pleroma or Akkoma, this will be located under `/opt/pleroma/instance/static/instance`.
This directory contains files that are loaded on-demand by the browser, including about pages.

Just create a file like `instance/about/hello.html` on your server and it will become available under `/about/hello` on your instance.
If you create a file called `index.html`, it will be treated as the root (available under `/about`), and you can create subfolders too.

For convenience, Mangane and Pleroma ships with sample files under `instance/about.example`.
Simply rename that directory to `about` and start editing!
