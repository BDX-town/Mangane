# Customizing Mangane

Mangane uses your own site's name and branding throughout the interface.
This allows every Mangane site to be different, and catered to a particular audience.
Unlike Mastodon, which uses the "Mastodon" branding on all instances, Mangane does not refer to itself in the user interface.

## Backend settings

The site's name and description are **configured in the backend itself.**
These are settings global to your website, and will also affect mobile apps and other frontends accessing your website.

- On Mastodon, you can change it through the admin interface.
- On Pleroma, it can be edited through AdminFE, or by editing `config/prod.secret.exs` on the server.

These settings are exposed through the API under GET `/api/v1/instance`.

## Mangane settings

Most settings are specific to your Mangane installation and not the entire website.
That includes the logo, default theme, and more.

- On Pleroma, admins can edit these settings directly from Mangane. Just click "Mangane config" in the sidebar, or navigate directly to `/mangane/config`.
- On Mastodon, admins need to upload a JSON file with the settings, and make it available at `https://yoursite.tld/instance/mangane.json`.

If using Pleroma, these settings are exposed through the API under GET `/api/pleroma/frontend_configurations`.
Otherwise, the settings need to be uploaded manually and made available at GET `/instance/mangane.json`.

### The instance logo
The instance logo must be a valid svg file. It will be shown in pages using the same icon system than the rest of the app, in order to match the colors settings. Be sure to use a 'raw' svg file, and to not simply use a svg wrapper for a bitmap image. 

If you want the logo to match your color settings, you will need to update it so every `fill` or `stroke` property that you want to change use the special value `currentColor`
https://css-tricks.com/currentcolor/

## About pages

It is possible to create arbitrary HTML pages under `/about/:page` on your website.

In your Mangane installation directory (probably on your server), find the `instance` folder.
For Pleroma, this will be located under `/opt/pleroma/instance/static/instance`.
This directory contains files that are loaded on-demand by the browser, including about pages.

Just create a file like `instance/about/hello.html` on your server and it will become available under `/about/hello` on your instance.
If you create a file called `index.html`, it will be treated as the root (available under `/about`), and you can create subfolders too.

For convenience, Mangane ships with sample files under `instance/about.example`.
Simply rename that directory to `about` and start editing!
