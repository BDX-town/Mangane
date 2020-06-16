# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [Unreleased patch]
### Fixed
- Composer: Forcing the scope to default after settings save.

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
