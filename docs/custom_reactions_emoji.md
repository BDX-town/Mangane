## **How to add new emojis to a reaction on a status?**

1. We clone the Mangane repository to our computer/server and then open the file **app/soapbox/locales/defaultMessages.json**
In it, we look for the field `"defaultMessage": "Love",_"`.
After it, we indent to write code for our emoji (to make the translation work).
![](https://telegra.ph/file/2aac2c64934dae56f8357.png)
In my case, I translated the emoji "Okay" and named its ID as "status.reactions.okay".

2. Now we go to **app/soapbox/components/status-action-bar.tsx** and search for `_reactionHeart: { id: 'status.reactions.heart', defaultMessage: 'Love' },` After that, we simply duplicate its code, replacing "heart" and "love" with the name and description of our emoji. For example, we replace `status.reactions.heart" with "status.reactions.okay` and replace `defaultMessage: 'Love'` with `defaultMessage: 'I'm okay'` (default language is English).
![enter image description here](https://telegra.ph/file/583bc89b8aa9af7dc24d0.png)

3. After this step, we go to the file with our localization and add new translation lines. In my case, it's Ukrainian localization, so the file **app/soapbox/locales/uk.json**

![enter image description here](https://telegra.ph/file/22af87c7465d0ca430479.png)

4. "Now that we have finished with the localization, we go to the configuration file of Mangane(Soapbox), which is located at app/soapbox/normalizers/soapbox/soapbox_config.ts, and look for `❤️,` in it.
We can add our newly created emoji in a similar manner. For example, we can add our "Okay" emoji by adding the following line to the config file: `'👌',`
This will add the "Okay" emoji to the list of available reactions in the app."
![enter image description here](https://telegra.ph/file/e22708475171d322b6f23.png)

5. In this file, we are almost done. Now, we go to the last file, which is **app/soapbox/utils/emoji_reacts.ts**. We can add our newly created emoji in the same way as we did in soapbox_config.ts and we are done.
![enter image description here](https://telegra.ph/file/f3913bff911e18fe1c345.png)

Now, we need to build Mangane and install it on our instance. After installation, the new reactions will appear when we click the 'Refresh' button on the website.

If you want to see how I did it in my repository, you can check it out at the following [link.](https://github.com/ua-thinking/ak.noleron.com/commit/2d20b259f95b0a895d376a43890d523c189d0781)