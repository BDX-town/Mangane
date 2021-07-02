# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2021-07-02
### Changed
- Layout: show right sidebar on all pages.
- Statuses: improve display of multiple rich media items.
- Statuses: let media be cropped less (when dimensions are provided).
- Profile metadata: show only 4 by default, let items be added and removed.

### Fixed
- Performance: fixed various performance issues, especially related to the post composer and chats.
- Composer: fixed upload form style on light theme.
- Composer: fixed emoji search when a custom emoji was invalid.
- Composer: fixed uploaded images sometimes being turned sideways.
- Chats: fix "Message" button on intermediate screen sizes.
- Chats: filter out invalid chats.
- Notifications: fixed notification counter on Brave Android (and possibly others).
- Localization: fixed hardcoded strings.
- Lists: fixed frontend issues related to lists (there are still backend issues).
- Modals: fixed unauthorized modal style.
- Hotkeys: remove unused hotkeys, fix broken ones.
- Sidebar: fix alignment of icons.
- Various iOS fixes.

### Added
- Statuses: added greentext support, configurable site-wide by admin.
- Statuses: added Mastodon's audio player.
- Statuses: indicate > 4 attachments.
- Statuses: display tombstones in place of deleted posts (to not break threads).
- Composer: added blurhash to upload form.
- Localization: support localization of About pages, Promo Panel items, and Link Footer items.
- Localization: display labels for default emoji reactions.
- Alerts: return detailed error for 502.
- Profile: support hidden stats.
- Profile: support blocking notifications from people you don't follow.
- Notifications: support account move notification.
- Timelines: let Fediverse explanation box be dismissed.
- Admin: optimistic user deletion.
- Admin: add monthly active users count to dashboard.
- Admin: add user retention % to dashboard.

## [1.2.3] - 2021-04-18
### Changed
- Twemoji now bundled

### Fixed
- Redirect user after registration
- Delete invalid auth users from browser
- Uploaded files ending in .blob

## [1.2.2] - 2021-04-13
### Fixed
- verify_credentials infinite loop bug
- Emoji reacts not being sent through notifications
- Contrast of Polls

### Added
- Configurable FQN for local accounts
- Polish translations

## [1.2.1] - 2021-04-06
### Fixed
- "View context" button on videos
- Login page successfully redirects Home

## [1.2.0] - 2021-04-02
### Added
- Remote follow button
- Display "Bot" tag for bot users
- Ability to view remote timelines
- Admin interface
- Integrated moderation features
- Multiple account support
- Verification (blue checkmark)
- Better support for follow requests
- Improve feedback when registering a new account
- Ability to import Mutes from CSV
- Add server information page
- "Follow" button is more responsive
- Portuguese translations

### Fixed
- Heart reaction works on Pleroma >= 2.3.0
- Pagination of Blocks and Mutes

## [1.1.0] - 2020-10-05
### Fixed
- General user interface and ease-of-use improvements for both mobile and desktop
- General loading and performance improvements, including shrinking bundle size
- GIF handling: AutoPlayGif Preference support, including avatars and profile banners
- Sidebar menu browser compatibility
- React 17.x compatibility
- Timeline jumping during scroll
- Collapse of compose modal after privacy scope change
- Media attachment rendering
- Thread view reply post rendering
- Thread view scroll to selected post rendering
- Bookmarking of posts
- Edit Profile: checkbox handling
- Edit Profile: multi-line bio with link support
- Muted Users: posts of muted users now appear in profile view
- Forms: security issue resolved with POST method on all forms
- Internationalization: increased elements that are internationalizable
- Composer: Forcing the scope to default after settings save.

### Added
- Chats, currently one-to-one, evolving with Pleroma BE capabilities, including:
    - Initiate chat via `Message` button on profile
    - Up to 4 open foreground chat windows in desktop, with open/minimize/close and notification counter
    - Browser tab notification counter includes total chat and post notifications
    - Chats list with total chats notification counter and audio notification toggle
    - Unique chat audio notification
    - Add attachment
    - Delete chat message
    - Report chat account
    - Chats icon with notification counter in top navbar in mobile view
    - Chats marked read on chat hover or on chat key event
- Audio player for audio uploads, including ogg, oga, and wav support
- Integration with Patron recurring donations platform
- Profile hover panels, with click to Follow/Unfollow
- Posts: Favicon of user's home instance included on post
- Soapbox configuration page, including:
    - Site preview, including light/dark theme toggle rendering
    - Logo
    - Brand color using color picker
    - Copyright footer
    - Promo panel custom links for timeline pages
    - Home footer custom links for static pages
    - Editable JSON based configuration option
- Themes: Light/dark theme toggle in top navbar
- Themes: Halloween mode in Preferences page
- Markdown support in post composer, as default
- Loading indicator general improvements
- Polls: Add media attachments
- Polls: Mouseover hint on poll compose radiobutton to teach single/multi-choice poll type toggling
- Polls: Remove blank poll by either toggling Poll icon or by removing poll options
- Registration: Support for `Account approval required` setting in Pleroma AdminFE, via dynamic `Why do you want to join?` textarea on registration page
- Filtering: `Muted Words` menu item and page
- Filtering: Direct messages filter toggle on Home timeline
- Floating top navbar during scroll
- Import Data: `Import follows` and `import blocks`
- Profile: Media panel
- Media: Media gallery thumbnails
- Media: Any media type as attachment
- General documentation improvements
- Delete Account feature for user self-deletion in Security page
- Registration: Captcha reload on image click
- Fediverse timeline explanation accordion toggle
- Tests: React reducers tests
- Profile: Max profile meta fields defined by Pleroma BE capability
- Profile: Verified user checkbox
- Admin: Reports counter and top navbar element for admin accounts, linked to Pleroma AdminFE
- [Renovate.json](https://docs.renovatebot.com/configuration-options/) support

### Changed
- Revoke OAuth token on logout
- Home sidebar rearrangement
- Compose form icons
- User event notifications: improved rendering and added color coding
- Home timeline: `Show reposts` filter toggle default to `off`
- Direct Messages: Changed API usage from `conversations` to `direct`
- Project documentation management system, using CI
- Documentation: site customization and installation on sub-domain
- Redux update

### Removed
- FontAwesome dependencies, with full switch to ForkAwesome
- Requirement for use of soapbox.json for configuration
- Direct Message links from menus, partial deprecation due to chats

## [1.0.0] - 2020-06-15
### Added
- Emoji reactions.
- Ability to set brand color in soapbox.json.
- Security UI.
- Proper i18n support.
- Link to AdminFE.
- Password reset.
- Ability to edit profile fields.
- Many new automated tests.

### Changed
- Overhauled theming system to use native CSS variables.
- Reorganized folder structure.
- Redesigned post composer.
- All references to "Gab" removed.
- Disable notification sounds by default.
- Rename 'Favourite' to 'Like'
- Improve design of floating compose button.
- Force media to have a static height, fixing jumpy timelines.

### Fixed
- Composer: Move cursor to end of text.
- Composer: Tagging yourself in replies.
- Composer: State issues between compose modal and inline composer.
- AutoPlayGif for images in posts.
- Handle registration when email confirmation is required.
- Ability to add non-follows to Lists.
- Don't hide locked accounts from non-followers.
- Delete + Redraft errors.
- Preferences: Display name limitations removed.
- Hide "Embed" functionality from menus.
- Only show 'Trends' and 'Who To Follow' when supported by the backend.
- Hide reposted media from account media tab.

## [0.9.0] - 2020-04-30
### Added
- Initial beta release.

[Unreleased]: https://gitlab.com/soapbox-pub/soapbox-fe/-/compare/v1.0.0...develop
[Unreleased patch]: https://gitlab.com/soapbox-pub/soapbox-fe/-/compare/v1.0.0...stable/1.0.x
[1.0.0]: https://gitlab.com/soapbox-pub/soapbox-fe/-/compare/v0.9.0...v1.0.0
[0.9.0]: https://gitlab.com/soapbox-pub/soapbox-fe/-/tags/v0.9.0
