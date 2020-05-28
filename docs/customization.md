# Customizing Soapbox

First [Install Soapbox](https://soapbox.pub/)

Soapbox supports customization of the user interface, to allow per instance branding and other features.  Current customization features include:
* Instance name
* Site logo
* Promo panel list items, e.g. blog site link
* Favicon
* About page
* Terms of Service page
* Privacy Policy page
* Copyright Policy page
* Soapbox extensions
* Default settings

## Instance Name
Instance name is edited during the Pleroma installation step or via admin configuration

## Instance Description
Instance description is edited during the Pleroma installation step or via admin configuration

## Captcha on Registration Page
Use of the Captcha feature on the registration page is configured during the Pleroma installation step or via admin configuration

## Site Logo and Promo Panel List Items
The site logo and promo panel list items are customized by copying `soapbox.example.json` in the `static/instance` folder to `soapbox.json`.
The site logo, in SVG format, is rendered to be able to allow the site theme colors to appear in the less than 100% opaque sections of the logo.
The logo colors are rendered in a color that provides contrast for the site theme.

The `navlinks` section of the `soapbox.json` file references the links that are displayed at the bottom of the Registration/Login, About, Terms of Service, Privacy Policy and Copyright Policy (DMCA) pages.

After editing your HTML files and folder names, re-create the webpack and restart the soapbox-fe service to effect the changes.

Following is an example of the contents of `soapbox.example.json`:
```
{
  "logo": "https://media.gleasonator.com/site_uploads/files/000/000/002/original/logo.svg",
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
    "theme": "azure"
  },
  "copyright": "?2020. Copying is an act of love. Please copy and share.",
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

## Favicon
The favicon is customized by dropping a favicon.png file into the `/static` folder. 
Re-create the webpack and start the soapbox-fe service to effect the changes.

## About Page, Terms of Service Page, Privacy Policy Page and Copyright Policy (DMCA) Page
These pages are all available for editing in the `static/instance/about.example` folder, as template files, named as:
* index.html
* tos.html
* privacy.html
* dmca.html
 
The `soapbox.json` file navlinks section's default URL valuess are pointing to the above file location, when the `about.example` folder is renamed to `about`
These four template files have placeholders in them, e.g. "Your_Instance", that should be edited to match your Soapbox instance configuration, and will be meaningless to your users until you edit them.

These pages will not become available resources on your instance until you rename the `static/instance/about.example` folder to `static/instance/about`, re-create the webpack and start the soapbox-fe service.

## Source Code Link
The Source Code link in the `soapbox.json` file, if used, references a bookmark in the `index.html` file in the `about` folder.  The template index.html file has a default bookmark and URL defined in it that you can edit.



