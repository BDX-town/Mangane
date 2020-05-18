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

## Instance Name
Instance name is edited during the Pleroma installation step or via admin configuration

## Instance Description
Instance description is edited during the Pleroma installation step or via admin configuration

## Captcha on Registration Page
Use of Captcha on registration page is edited during the Pleroma installation step or via admin configuration

## Site Logo and Promo Panel List Items
The site logo and promo panel list items are customized by copying `soapbox.example.json` in the `static/instance` folder to `soapbox.json`.
The site logo, in SVG format, is rendered to be able to allow the site theme colors to appear in the less than 100% opaque sections of the logo.
The logo colors are rendered in a color that provides contrast for the site theme.
Re-create the webpack and restart the soapbox-fe service to effect the changes.

An example of the contents of `soapbox.example.json`:
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
    "theme": "lime"
  }
}
```

## Favicon
The favicon is customized by dropping a favicon.png file into the `/static` folder. 
Re-create the webpack and restart the soapbox-fe service to effect the changes.

## About Page, Terms of Service Page, Privacy Policy Page and Copyright Policy Page
These pages are all available for editing in the `static/instance/about.example` folder, as template files, named as:
* index.html
* tos.html
* privacy.html
* dmca.html
These four template files have placeholders in them, e.g. "Your_Instance", that should be edited to match your Soapbox instance configuration, and will be meaningless to your users until you edit them.
The pages will not become available resources on your instance until you rename the `static/instance/about.example` folder to `static/instance/about`
