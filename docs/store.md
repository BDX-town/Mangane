# Redux Store Map

A big part of what makes soapbox-fe function is the [Redux](https://redux.js.org/) store.
Redux is basically a database of everything your frontend needs to know about in the form of a giant JSON object.

To work with Redux, you will want to install the [Redux browser extension](https://extension.remotedev.io/).
This will allow you to see the full Redux store when working in development.

Due to the large size of the Redux store in soapbox-fe, it's worth documenting the purpose of each path.

If it's not documented, it's because I inherited it from Mastodon and I don't know what it does yet.

- `dropdown_menu`

- `timelines`

- `meta` - User-specific data that is _not_ a frontend setting (see: `settings`). 
    
    Sample:
    ```
    meta: {
     pleroma: {
       unread_conversation_count: 0,
       hide_follows: false,
       hide_followers_count: false,
       background_image: 'https://dev.teci.world/media/74644a40461bb85fa41db02547b656fa382e0e2ada29021059ff2a2956c1bbab.jpg',
       confirmation_pending: false,
       is_moderator: false,
       deactivated: false,
       chat_token: 'SFMyNTY.g3QAAAACZAAEZGF0YW0AAAASOXRvMU5QeVM5OEo4Y2RpY1JFZAAGc2lnbmVkbgYAcH3yxnEB.qD9qQzEfRH4sfJQfPCJQKHayVUQ6_1m6t5iqE7jB17Q',
       allow_following_move: true,
       hide_follows_count: false,
       notification_settings: {
         followers: true,
         follows: true,
         non_followers: true,
         non_follows: true,
         privacy_option: false
       },
       hide_followers: false,
       relationship: {
         showing_reblogs: true,
         followed_by: false,
         subscribing: false,
         blocked_by: false,
         requested: false,
         domain_blocking: false,
         following: false,
         endorsed: false,
         blocking: false,
         muting: false,
         id: '9to1NPyS98J8cdicRE',
         muting_notifications: false
       },
       tags: [],
       hide_favorites: true,
       is_admin: true,
       skip_thread_containment: false
     }
    },
    ```

- `pleroma` - Pleroma specific metadata about the user pulled from `/api/v1/accounts/verify_credentials` (excluding the pleroma_settings_store)

- `alerts`

- `loadingBar` - Managed by [react-redux-loading-bar](https://github.com/mironov/react-redux-loading-bar)

- `modal`

- `user_lists`
    
    Sample:
    ```
   user_lists: {
     reblogged_by: {},
     blocks: {},
     groups_removed_accounts: {},
     following: {},
     follow_requests: {},
     groups: {},
     followers: {},
     mutes: {},
     favourited_by: {}
   },
    ```

- `domain_lists`

- `status_lists`

- `accounts` - Data for all accounts you've viewed since launching the page, so they don't have to be downloaded twice. 
    
    Sample:
    ```
    accounts: {
     '9to1NPyS98J8cdicRE': {
       header_static: 'https://dev.teci.world/media/27272c6f53a8a535d2c11a98d3b3473833bf80192e82347548b9f1b6dc4027ab.jpg',
       display_name_html: 'crockwave',
       follow_requests_count: 0,
       bot: false,
       display_name: 'crockwave',
       created_at: '2020-04-07T16:29:04.000Z',
       locked: false,
       emojis: [],
       header: 'https://dev.teci.world/media/27272c6f53a8a535d2c11a98d3b3473833bf80192e82347548b9f1b6dc4027ab.jpg',
       url: 'https://dev.teci.world/users/curtis',
       note: '',
       acct: 'curtis',
       avatar_static: 'https://dev.teci.world/media/3e41f0e4e0b7e673959061f90c69a57ff547bd48ccca90df5d46be87a874febd.png',
       username: 'curtis',
       avatar: 'https://dev.teci.world/media/3e41f0e4e0b7e673959061f90c69a57ff547bd48ccca90df5d46be87a874febd.png',
       fields: [],
       pleroma: {
         unread_conversation_count: 0,
         hide_follows: false,
         hide_followers_count: false,
         background_image: 'https://dev.teci.world/media/74644a40461bb85fa41db02547b656fa382e0e2ada29021059ff2a2956c1bbab.jpg',
         confirmation_pending: false,
         is_moderator: false,
         deactivated: false,
         allow_following_move: true,
         hide_follows_count: false,
         notification_settings: {
           followers: true,
           follows: true,
           non_followers: true,
           non_follows: true,
           privacy_option: false
         },
         hide_followers: false,
         relationship: {
           showing_reblogs: true,
           followed_by: false,
           subscribing: false,
           blocked_by: false,
           requested: false,
           domain_blocking: false,
           following: false,
           endorsed: false,
           blocking: false,
           muting: false,
           id: '9to1NPyS98J8cdicRE',
           muting_notifications: false
         },
         tags: [],
         hide_favorites: true,
         is_admin: true,
         skip_thread_containment: false
       },
       source: {
         fields: [],
         note: '',
         pleroma: {
           actor_type: 'Person',
           discoverable: false,
           no_rich_text: false,
           show_role: true
         },
         privacy: 'public',
         sensitive: false
       },
       id: '9to1NPyS98J8cdicRE',
       note_emojified: ''
     }
    },
    ```

- `accounts_counters`

- `statuses` - Data for all statuses you've viewed since launching the page, so they don't have to be downloaded twice.
    
    Sample:
    ```
    statuses: {
     '9uVxGSYFo6ooon0ebQ': {
       in_reply_to_account_id: null,
       contentHtml: '<p>jpg test <span class="h-card"><a href="https://dev.teci.world/users/curtis" class="u-url mention">@<span>curtis</span></a></span></p>',
       mentions: [
         {
           acct: 'curtis',
           id: '9to1NPyS98J8cdicRE',
           url: 'https://dev.teci.world/users/curtis',
           username: 'curtis'
         }
       ],
       created_at: '2020-04-28T21:10:16.000Z',
       spoiler_text: '',
       hidden: false,
       muted: false,
       uri: 'https://gleasonator.com/users/crockwave/statuses/104078260079111405',
       spoilerHtml: '',
       emojis: [],
       account: '9toTIlRPKG2j5obki8',
       reblogs_count: 0,
       url: 'https://gleasonator.com/@crockwave/posts/104078260079111405',
       application: {
         name: 'Web',
         website: null
       },
       card: null,
       in_reply_to_id: null,
       reblogged: false,
       visibility: 'public',
       bookmarked: false,
       reblog: null,
       media_attachments: [
         {
           description: null,
           id: '1375732379',
           pleroma: {
             mime_type: 'image/jpeg'
           },
           preview_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
           remote_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
           text_url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg',
           type: 'image',
           url: 'https://media.gleasonator.com/media_attachments/files/000/853/856/original/7035d67937053e1d.jpg'
         }
       ],
       sensitive: false,
       replies_count: 0,
       language: null,
       pinned: false,
       tags: [],
       content: '<p>jpg test <span class="h-card"><a href="https://dev.teci.world/users/curtis" class="u-url mention">@<span>curtis</span></a></span></p>',
       favourites_count: 0,
       pleroma: {
         direct_conversation_id: null,
         spoiler_text: {
           'text/plain': ''
         },
         local: false,
         emoji_reactions: [],
         thread_muted: false,
         conversation_id: 1951,
         content: {
           'text/plain': 'jpg test @curtis'
         },
         in_reply_to_account_acct: null,
         expires_at: null
       },
       favourited: false,
       id: '9uVxGSYFo6ooon0ebQ',
       search_index: 'jpg test @curtis',
       poll: null
     }
    },
    ```
    
- `relationships`

- `settings` - Any frontend configuration values that should be persisted to the backend database. This includes user preferences as well as metadata such as emoji usage counters. It uses [`pleroma_settings_store`](https://docs-develop.pleroma.social/backend/API/differences_in_mastoapi_responses/#accounts) to do it if it's available. If there's some other endpoint that handles your value, it doesn't belong here.
    
    Sample:
    ```
    settings: {
     autoPlayGif: true,
     displayMedia: true,
     deleteModal: true,
     unfollowModal: false,
     frequentlyUsedEmojis: {
       grinning: 1,
       'star-struck': 1
     },
     onboarded: false,
     defaultPrivacy: 'private',
     demetricator: false,
     saved: true,
     notifications: {
       alerts: {
         favourite: true,
         follow: true,
         mention: true,
         poll: true,
         reblog: true
       },
       quickFilter: {
         active: 'all',
         advanced: false,
         show: true
       },
       shows: {
         favourite: true,
         follow: true,
         mention: true,
         poll: true,
         reblog: true
       },
       sounds: {
         favourite: true,
         follow: true,
         mention: true,
         poll: true,
         reblog: true
       }
     },
     theme: 'azure',
     'public': {
       other: {
         onlyMedia: false
       },
       regex: {
         body: ''
       }
     },
     direct: {
       regex: {
         body: ''
       }
     },
     community: {
       other: {
         onlyMedia: false
       },
       regex: {
         body: ''
       }
     },
     boostModal: false,
     dyslexicFont: false,
     expandSpoilers: false,
     skinTone: 1,
     trends: {
       show: true
     },
     reduceMotion: false,
     columns: [
       {
         id: 'COMPOSE',
         params: {},
         uuid: '8200299a-f689-45ad-ad33-c9eb20b6286c'
       },
       {
         id: 'HOME',
         params: {},
         uuid: '1b1f69f4-d024-4d31-b5cd-b45fe77f4dc1'
       },
       {
         id: 'NOTIFICATIONS',
         params: {},
         uuid: 'e8c3904c-bf54-4047-baaa-aa786afebb3b'
       }
     ],
     systemFont: false,
     home: {
       regex: {
         body: ''
       },
       shows: {
         reblog: true,
         reply: true
       }
     }
   },
    ```
    
- `push_notifications`

- `mutes`

- `reports`

- `contexts`

- `compose`

- `search`

- `media_attachments`

- `notifications`
    
    Sample:
    ```
    notifications: {
     items: [
       {
         id: '27',
         type: 'mention',
         account: '9uXUwPp1pwGsA2Qh3A',
         created_at: '2020-04-29T15:11:54.000Z',
         status: '9uXVnHKu7Lu9BrXvCC'
       },
       {
         id: '8',
         type: 'mention',
         account: '9toQ7nsnbhnTcNVBxI',
         created_at: '2020-04-27T19:16:44.000Z',
         status: '9uTicLRt0ZoVX25ZvE'
       },
       {
         id: '7',
         type: 'favourite',
         account: '9toQ7nsnbhnTcNVBxI',
         created_at: '2020-04-27T19:16:25.000Z',
         status: '9uThsXbbTg6luknEmG'
       }
     ],
     hasMore: true,
     top: false,
     unread: 0,
     isLoading: false,
     queuedNotifications: [],
     totalQueuedNotificationsCount: 0,
     lastRead: -1
    },
    ```

- `height_cache` 
    
    Sample:
    ```
    height_cache: {
     '9t06sd:home_timeline': {
     '9uXhrY530I85jJvpwW': 164.171875,
     '9uXVdgMQDqa1uGgESG': 300.140625,
     '9uXWs4FmHnJW17zncW': 852.171875,
     '9uXX4IfAXO0yBNhmQy': 166.171875,
     '9uXXThi8XzE56gCtE0': 145.140625
     }
    },
    ```

- `custom_emojis`

- `identity_proofs`

- `lists`

- `listEditor`

- `listAdder`

- `filters`

- `conversations`

- `suggestions`

- `polls`

- `trends`

- `groups`

- `group_relationships`

- `group_lists`

- `group_editor`

- `sidebar`

- `patron` - Data related to [soapbox-patron](https://gitlab.com/soapbox-pub/soapbox-patron)

- `soapbox` - Soapbox specific configuration pulled from `/instance/soapbox.json`. The configuration file isn't required and this map can be empty. 
    
    Sample:
    ```
    soapbox: {
     logo: 'https://support.wirelessmessaging.com/temp/tga/teci_social_logo.svg',
     promoPanel: {
       items: [
         {
           icon: 'comment-o',
           text: 'TECI blog',
           url: 'https://www.teci.world/blog'
         }
       ]
     },
     extensions: {
       patron: false
     }
    },
    ```

- `instance` - Instance data pulled from `/api/v1/instance`

- `me` - The account ID of the currently logged in user, 'null' if loading, and 'false' if no user is logged in.

- `auth` - Data used for authentication

- `app` - Map containing the app used to make app requests such as register/login and its access token.

- `user` - Map containing the access token of the logged in user.
