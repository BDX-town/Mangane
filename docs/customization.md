# Customizing Soapbox

Soapbox uses your own site's name and branding throughout the interface.
This allows every Soapbox site to be different, and catered to a particular audience.
Unlike Mastodon, which uses the "Mastodon" branding on all instances, Soapbox does not refer to itself in the user interface.

## Backend settings

The site's name and description are **configured in the backend itself.**
These are settings global to your website, and will also affect mobile apps and other frontends accessing your website.

- On Mastodon, you can change it through the admin interface.
- On Pleroma, it can be edited through AdminFE, or by editing `config/prod.secret.exs` on the server.

These settings are exposed through the API under GET `/api/v1/instance`.

## Soapbox settings

Most settings are specific to your Soapbox installation and not the entire website.
That includes the logo, default theme, and more.

- On Pleroma, admins can edit these settings directly from Soapbox. Just click "Soapbox config" in the sidebar, or navigate directly to `/soapbox/config`.
- On Mastodon, admins need to upload a JSON file with the settings, and make it available at `https://yoursite.tld/instance/soapbox.json`.

If using Pleroma, these settings are exposed through the API under GET `/api/pleroma/frontend_configurations`.
Otherwise, the settings need to be uploaded manually and made available at GET `/instance/soapbox.json`.
