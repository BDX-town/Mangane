# Customizing Soapbox

If you haven't already, [install Soapbox](../installing). But before you install soapbox, you should consider how Soapbox is installed, by default.

Soapbox, by default, is installed to replace the default Pleroma front end.  By extension, the Pleroma Masto front end continues to be available at the `/web` sub-URL, which you can reference, if you'd like, in the `promoPanel` section of `soapbox.json`

There are two main places Soapbox gets its configuration:

- `/opt/pleroma/config/prod.secret.exs`

- `/opt/pleroma/instance/static/instance/soapbox.json`

Logos, branding, etc. take place in the `soapbox.json` file.
For example:

```json
{
  "logo": "/instance/images/soapbox-logo.svg",
  "brandColor": "#0482d8",
  "promoPanel": {
    "items": [{
      "icon": "area-chart",
      "text": "Our Site stats",
      "url": "https://fediverse.network/example.com"
    }, {
      "icon": "comment-o",
      "text": "Our Site blog",
      "url": "https://blog.example.com"
    }]
  },
  "extensions": {
    "patron": false
  },
  "defaultSettings": {
    "autoPlayGif": false,
    "themeMode": "light"
  },
  "copyright": "♡2020. Copying is an act of love. Please copy and share.",
  "customCss": [
    "/instance/static/your_file_here.css"
  ],
  "navlinks": {
    "homeFooter": [
      { "title": "About", "url": "/about" },
      { "title": "Terms of Service", "url": "/about/tos" },
      { "title": "Privacy Policy", "url": "/about/privacy" },
      { "title": "DMCA", "url": "/about/dmca" },
      { "title": "Source Code", "url": "/about#opensource" }
    ]
  }
}
```

Customizable features include:

* Instance name
* Site logo
* Promo panel list items, e.g. blog site link
* Favicon
* About pages
* Default user settings
* Cascadomg Style Sheets (CSS)

## Instance Name
Instance name is edited during the Pleroma installation step or via AdminFE.

## Instance Description
Instance description is edited during the Pleroma installation step or via AdminFE.

## Captcha on Registration Page
Use of the Captcha feature on the registration page is configured during the Pleroma installation step or via AdminFE.

## Site Logo, Brand Color, and Promo Panel List Items
The site logo, brand color, and promo panel list items are customized by copying `soapbox.example.json` in the `static/instance` folder to `soapbox.json` and editing that file.  It is recommended that you test your edited soapbox.json file in a JSON validator, such as [JSONLint](https://jsonlint.com/), before using it.

The icon names for the promo panel list items can be source from [Fork Awesome](https://forkaweso.me/Fork-Awesome/icons/). Note that you should hover over or click a selected icon to see what the icon's real name is, e.g. `world`

The site logo, in SVG format, is rendered to be able to allow the site theme colors to appear in the less than 100% opaque sections of the logo.
The logo colors are rendered in a color that provides contrast for the site theme.

The `navlinks` section of the `soapbox.json` file references the links that are displayed at the bottom of the Registration/Login, About, Terms of Service, Privacy Policy and Copyright Policy (DMCA) pages.

The `brandColor` in `soapbox.json` refers to the main color upon which the look of soapbox-fe is defined.

After editing your HTML files and folder names, save the file and refresh your browser.

## Favicon
The favicon is customized by dropping a favicon.png file into the `/static` folder and refreshing your browser.

## About Pages
Soapbox supports any number of custom HTML pages under `yoursite.com/about/:slug`.

The finder will search `/opt/pleroma/instance/static/instance/about/:slug.html` to find your page.
Use the name `index.html` for the root page.

Example templates are available for editing in the `static/instance/about.example` folder, such as:
* index.html
* tos.html
* privacy.html
* dmca.html

Simply rename `about.example` to `about`, or create your own.

The `soapbox.json` file navlinks section's default URL values are pointing to the above file location, when the `about.example` folder is renamed to `about`
These four template files have placeholders in them, e.g. "Your_Instance", that should be edited to match your Soapbox instance configuration, and will be meaningless to your users until you edit them.

## Alternate Soapbox URL Root Location
If you want to install Soapbox at an alternate URL, allowing you to potentially run more than 2 front ends on a Pleroma server, you can consider deploying the Nginx config created by @a1batross, available [here](https://git.mentality.rip/a1batross/soapbox-nginx-config/src/branch/master/soapbox.nginx)

Tech support is limited for this level of customization
