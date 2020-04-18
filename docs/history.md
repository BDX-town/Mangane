# History

In order to better understand soapbox-fe, this document tells the story of how it came to be.

## March 2016, Mastodon

Mastodon, a federated microblogging platform, was released.
Mastodon is built with Ruby on Rails and uses React.js for its frontend.

The React frontend uses [standardized API endpoints](https://docs.joinmastodon.org/methods/accounts/) to handle all actions.

## July 2019, gab.com relaunch

In July 2019, Gab forked Mastodon 2.8.4 and migrated to it.
They overhauled Mastodon's user interface into a streamlined single-column UI with a prettier stylesheet.

Like Mastodon, Gab's fork is [open source](https://code.gab.com/gab/social/gab-social).

## August 2019, spinster.xyz launch

Spinster is a feminist platform I helped launch, forked from Gab's Mastodon version.

I began to heavily customize it with additional themes, integrated Stripe donations, and more.
I created the fork early on, and did not adopt many of the features (and bugs) that Gab added later.

## December 2019, Soapbox

I decided to rebrand the Spinster codebase to be more neutral, calling it "Soapbox" (coined by `@grrrandma@spinster.xyz`).

I wanted Soapbox to be something others would use.
However, Mastodon still had fundamental problems, and I began eye alternatives like Pleroma.

My goal with Soapbox is to attract non-technical people to the Fediverse.
In order to do that, I need to experiment and run a lot of servers, but Mastodon makes that very expensive since it requires a lot of RAM to run.
Meanwhile Pleroma is worlds more efficient, and would make things a lot cheaper for me in the long run.

## February 2020, HYDRA Social

I began contracting with Gab to create HYDRA Social, a Node.js Fediverse backend.
Node.js is also more efficient than Ruby and could have solved the problem.

For reasons I still don't understand, I was removed from the project after only a month.

## March 2020, soapbox-fe

I was in a headspace of making big changes, and decided to take on the move of Soapbox to Pleroma.
To do this, I would separate the frontend into its own repo to run on top of Pleroma, greatly simplifying the system.

This is only possible because Pleroma implements most of Mastodon's API endpoints, allowing me to re-use the majority of Soapbox's frontend code.

At the time of writing, I'm still getting soapbox-fe off the ground by implementing the basic features it needs to power Spinster and other sites.
