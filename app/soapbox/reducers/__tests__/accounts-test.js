import reducer from '../accounts';
import { Map as ImmutableMap } from 'immutable';
import * as actions from 'soapbox/actions/accounts';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  it('should handle ACCOUNT_IMPORT', () => {
    const state = ImmutableMap({ });
    const account = {
      '9w1HhmenIAKBHJiUs4': {
        header_static: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        display_name_html: 'Alex Gleason',
        bot: false,
        display_name: 'Alex Gleason',
        created_at: '2020-06-12T21:47:28.000Z',
        locked: false,
        emojis: [],
        header: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        url: 'https://gleasonator.com/users/alex',
        note: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.',
        acct: 'alex@gleasonator.com',
        avatar_static: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        username: 'alex',
        avatar: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        fields: [
          {
            name: 'Website',
            value: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            name_emojified: 'Website',
            value_emojified: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            value_plain: 'https://alexgleason.me'
          },
          {
            name: 'Pleroma+Soapbox',
            value: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            name_emojified: 'Pleroma+Soapbox',
            value_emojified: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            value_plain: 'https://soapbox.pub'
          },
          {
            name: 'Email',
            value: 'alex@alexgleason.me',
            name_emojified: 'Email',
            value_emojified: 'alex@alexgleason.me',
            value_plain: 'alex@alexgleason.me'
          },
          {
            name: 'Gender identity',
            value: 'Soyboy',
            name_emojified: 'Gender identity',
            value_emojified: 'Soyboy',
            value_plain: 'Soyboy'
          }
        ],
        pleroma: {
          hide_follows: false,
          hide_followers_count: false,
          background_image: null,
          confirmation_pending: false,
          is_moderator: false,
          hide_follows_count: false,
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
            id: '9w1HhmenIAKBHJiUs4',
            muting_notifications: false
          },
          tags: [],
          hide_favorites: true,
          is_admin: false,
          skip_thread_containment: false
        },
        source: {
          fields: [],
          note: 'Fediverse developer. I come in peace. #vegan #freeculture #atheist #antiporn #gendercritical. Boosts ≠ endorsements.',
          pleroma: {
            actor_type: 'Person',
            discoverable: false
          },
          sensitive: false
        },
        id: '9w1HhmenIAKBHJiUs4',
        note_emojified: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.'
      }
    };
    const action = {
      type: actions.ACCOUNT_IMPORT,
      account: account,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
    });
  });

  it('should handle ACCOUNTS_IMPORT', () => {
    const state = ImmutableMap({ });
    const accounts = {
      '9w1HhmenIAKBHJiUs4': {
        header_static: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        display_name_html: 'Alex Gleason',
        bot: false,
        display_name: 'Alex Gleason',
        created_at: '2020-06-12T21:47:28.000Z',
        locked: false,
        emojis: [],
        header: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        url: 'https://gleasonator.com/users/alex',
        note: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.',
        acct: 'alex@gleasonator.com',
        avatar_static: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        username: 'alex',
        avatar: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        fields: [
          {
            name: 'Website',
            value: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            name_emojified: 'Website',
            value_emojified: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            value_plain: 'https://alexgleason.me'
          },
          {
            name: 'Pleroma+Soapbox',
            value: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            name_emojified: 'Pleroma+Soapbox',
            value_emojified: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            value_plain: 'https://soapbox.pub'
          },
          {
            name: 'Email',
            value: 'alex@alexgleason.me',
            name_emojified: 'Email',
            value_emojified: 'alex@alexgleason.me',
            value_plain: 'alex@alexgleason.me'
          },
          {
            name: 'Gender identity',
            value: 'Soyboy',
            name_emojified: 'Gender identity',
            value_emojified: 'Soyboy',
            value_plain: 'Soyboy'
          }
        ],
        pleroma: {
          hide_follows: false,
          hide_followers_count: false,
          background_image: null,
          confirmation_pending: false,
          is_moderator: false,
          hide_follows_count: false,
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
            id: '9w1HhmenIAKBHJiUs4',
            muting_notifications: false
          },
          tags: [],
          hide_favorites: true,
          is_admin: false,
          skip_thread_containment: false
        },
        source: {
          fields: [],
          note: 'Fediverse developer. I come in peace. #vegan #freeculture #atheist #antiporn #gendercritical. Boosts ≠ endorsements.',
          pleroma: {
            actor_type: 'Person',
            discoverable: false
          },
          sensitive: false
        },
        id: '9w1HhmenIAKBHJiUs4',
        note_emojified: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.'
      },
      '9w1HhmenIAKBHJiUs4': {
        header_static: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        display_name_html: 'Alex Gleason',
        bot: false,
        display_name: 'Alex Gleason',
        created_at: '2020-06-12T21:47:28.000Z',
        locked: false,
        emojis: [],
        header: 'https://media.gleasonator.com/accounts/headers/000/000/001/original/9d0e4dbf1c9dbc8f.png',
        url: 'https://gleasonator.com/users/alex',
        note: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.',
        acct: 'alex@gleasonator.com',
        avatar_static: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        username: 'alex',
        avatar: 'https://media.gleasonator.com/accounts/avatars/000/000/001/original/1a630e4c4c64c948.jpg',
        fields: [
          {
            name: 'Website',
            value: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            name_emojified: 'Website',
            value_emojified: '<a href="https://alexgleason.me" rel="ugc">https://alexgleason.me</a>',
            value_plain: 'https://alexgleason.me'
          },
          {
            name: 'Pleroma+Soapbox',
            value: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            name_emojified: 'Pleroma+Soapbox',
            value_emojified: '<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a>',
            value_plain: 'https://soapbox.pub'
          },
          {
            name: 'Email',
            value: 'alex@alexgleason.me',
            name_emojified: 'Email',
            value_emojified: 'alex@alexgleason.me',
            value_plain: 'alex@alexgleason.me'
          },
          {
            name: 'Gender identity',
            value: 'Soyboy',
            name_emojified: 'Gender identity',
            value_emojified: 'Soyboy',
            value_plain: 'Soyboy'
          }
        ],
        pleroma: {
          hide_follows: false,
          hide_followers_count: false,
          background_image: null,
          confirmation_pending: false,
          is_moderator: false,
          hide_follows_count: false,
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
            id: '9w1HhmenIAKBHJiUs4',
            muting_notifications: false
          },
          tags: [],
          hide_favorites: true,
          is_admin: false,
          skip_thread_containment: false
        },
        source: {
          fields: [],
          note: 'Fediverse developer. I come in peace. #vegan #freeculture #atheist #antiporn #gendercritical. Boosts ≠ endorsements.',
          pleroma: {
            actor_type: 'Person',
            discoverable: false
          },
          sensitive: false
        },
        id: '9w1HhmenIAKBHJiUs4',
        note_emojified: 'Fediverse developer. I come in peace. <a class="hashtag" data-tag="vegan" href="https://gleasonator.com/tag/vegan">#vegan</a> <a class="hashtag" data-tag="freeculture" href="https://gleasonator.com/tag/freeculture">#freeculture</a> <a class="hashtag" data-tag="atheist" href="https://gleasonator.com/tag/atheist">#atheist</a> <a class="hashtag" data-tag="antiporn" href="https://gleasonator.com/tag/antiporn">#antiporn</a> <a class="hashtag" data-tag="gendercritical" href="https://gleasonator.com/tag/gendercritical">#gendercritical</a>. Boosts ≠ endorsements.'
      }
    };
    const action = {
      type: actions.ACCOUNTS_IMPORT,
      accounts: accounts,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
    });
  });

  it('should handle ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', () => {
    const state = ImmutableMap({ username: 'curtis' });
    const action = {
      type: actions.ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
      username: 'curtis',
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      username: 'curtis',
    });
  });

});
