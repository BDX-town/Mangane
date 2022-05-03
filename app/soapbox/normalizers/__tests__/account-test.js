import { Record as ImmutableRecord, fromJS } from 'immutable';

import { normalizeAccount } from '../account';

const AVATAR_MISSING = require('images/avatar-missing.png');
const HEADER_MISSING = require('images/header-missing.png');

describe('normalizeAccount()', () => {
  it('adds base fields', () => {
    const account = {};
    const result = normalizeAccount(account);

    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.acct).toEqual('');
    expect(result.note).toEqual('');
    expect(result.avatar).toEqual(AVATAR_MISSING);
    expect(result.header_static).toEqual(HEADER_MISSING);
  });

  it('normalizes a mention', () => {
    const mention = {
      acct: 'NEETzsche@iddqd.social',
      id: '9v5bw7hEGBPc9nrpzc',
      url: 'https://iddqd.social/users/NEETzsche',
      username: 'NEETzsche',
    };

    const result = normalizeAccount(mention);
    expect(result.emojis).toEqual(fromJS([]));
    expect(result.display_name).toEqual('NEETzsche');
    expect(result.avatar).toEqual(AVATAR_MISSING);
    expect(result.avatar_static).toEqual(AVATAR_MISSING);
    expect(result.verified).toBe(false);
  });

  it('normalizes Fedibird birthday', () => {
    const account = require('soapbox/__fixtures__/fedibird-account.json');
    const result = normalizeAccount(account);

    expect(result.birthday).toEqual('1993-07-03');
  });

  it('normalizes Pleroma birthday', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);

    expect(result.birthday).toEqual('1993-07-03');
  });

  it('normalizes Pleroma legacy fields', () => {
    const account = require('soapbox/__fixtures__/pleroma-2.2.2-account.json');
    const result = normalizeAccount(account);

    expect(result.getIn(['pleroma', 'is_active'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_confirmed'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_approved'])).toBe(true);

    expect(result.hasIn(['pleroma', 'confirmation_pending'])).toBe(false);
  });

  it('prefers new Pleroma fields', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);

    expect(result.getIn(['pleroma', 'is_active'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_confirmed'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_approved'])).toBe(true);
  });

  it('normalizes a verified Pleroma user', () => {
    const account = require('soapbox/__fixtures__/mk.json');
    const result = normalizeAccount(account);
    expect(result.verified).toBe(true);
  });

  it('normalizes an unverified Pleroma user', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);
    expect(result.verified).toBe(false);
  });

  it('normalizes a verified Truth Social user', () => {
    const account = require('soapbox/__fixtures__/realDonaldTrump.json');
    const result = normalizeAccount(account);
    expect(result.verified).toBe(true);
  });

  it('normalizes Fedibird location', () => {
    const account = require('soapbox/__fixtures__/fedibird-account.json');
    const result = normalizeAccount(account);
    expect(result.location).toBe('Texas, USA');
  });

  it('normalizes Truth Social location', () => {
    const account = require('soapbox/__fixtures__/truthsocial-account.json');
    const result = normalizeAccount(account);
    expect(result.location).toBe('Texas');
  });

  it('normalizes Truth Social website', () => {
    const account = require('soapbox/__fixtures__/truthsocial-account.json');
    const result = normalizeAccount(account);
    expect(result.website).toBe('https://soapbox.pub');
  });

  it('sets display_name from username', () => {
    const account = { username: 'alex' };
    const result = normalizeAccount(account);
    expect(result.display_name).toBe('alex');
  });

  it('sets display_name from acct', () => {
    const account = { acct: 'alex@gleasonator.com' };
    const result = normalizeAccount(account);
    expect(result.display_name).toBe('alex');
  });

  it('overrides a whitespace display_name', () => {
    const account = { username: 'alex', display_name: ' ' };
    const result = normalizeAccount(account);
    expect(result.display_name).toBe('alex');
  });

  it('emojifies display name as `display_name_html`', () => {
    const account = require('soapbox/__fixtures__/account-with-emojis.json');
    const result = normalizeAccount(account);
    const expected = 'Alex Gleason <img draggable="false" class="emojione" alt="😂" title=":joy:" src="/packs/emoji/1f602.svg" /> <img draggable="false" class="emojione" alt=":soapbox:" title=":soapbox:" src="https://gleasonator.com/emoji/Gleasonator/soapbox.png" /> <img draggable="false" class="emojione" alt=":ablobcatrainbow:" title=":ablobcatrainbow:" src="https://gleasonator.com/emoji/blobcat/ablobcatrainbow.png" />';
    expect(result.display_name_html).toBe(expected);
  });

  it('emojifies note as `note_emojified`', () => {
    const account = require('soapbox/__fixtures__/account-with-emojis.json');
    const result = normalizeAccount(account);
    const expected = 'I create Fediverse software that empowers people online. <img draggable="false" class="emojione" alt=":soapbox:" title=":soapbox:" src="https://gleasonator.com/emoji/Gleasonator/soapbox.png" /><br/><br/>I&#39;m vegan btw<br/><br/>Note: If you have a question for me, please tag me publicly. This gives the opportunity for others to chime in, and bystanders to learn.';
    expect(result.note_emojified).toBe(expected);
  });

  it('unescapes HTML note as `note_plain`', () => {
    const account = require('soapbox/__fixtures__/account-with-emojis.json');
    const result = normalizeAccount(account);
    const expected = 'I create Fediverse software that empowers people online. :soapbox:\n\nI\'m vegan btw\n\nNote: If you have a question for me, please tag me publicly. This gives the opportunity for others to chime in, and bystanders to learn.';
    expect(result.note_plain).toBe(expected);
  });

  it('emojifies custom profile field', () => {
    const account = require('soapbox/__fixtures__/account-with-emojis.json');
    const result = normalizeAccount(account);
    const field = result.fields.get(1);

    expect(field.name_emojified).toBe('Soapbox <img draggable="false" class="emojione" alt=":ablobcatrainbow:" title=":ablobcatrainbow:" src="https://gleasonator.com/emoji/blobcat/ablobcatrainbow.png" />');
    expect(field.value_emojified).toBe('<a href="https://soapbox.pub" rel="ugc">https://soapbox.pub</a> <img draggable="false" class="emojione" alt=":soapbox:" title=":soapbox:" src="https://gleasonator.com/emoji/Gleasonator/soapbox.png" />');
    expect(field.value_plain).toBe('https://soapbox.pub :soapbox:');
  });

  it('adds default avatar and banner to GoToSocial account', () => {
    const account = require('soapbox/__fixtures__/gotosocial-account.json');
    const result = normalizeAccount(account);

    expect(result.avatar).toEqual(AVATAR_MISSING);
    expect(result.avatar_static).toEqual(AVATAR_MISSING);
    expect(result.header).toEqual(HEADER_MISSING);
    expect(result.header_static).toEqual(HEADER_MISSING);
  });

  it('adds fqn to Mastodon account', () => {
    const account = require('soapbox/__fixtures__/mastodon-account.json');
    const result = normalizeAccount(account);

    expect(result.fqn).toEqual('benis911@mastodon.social');
  });

  it('normalizes Pleroma staff', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);

    expect(result.admin).toBe(true);
    expect(result.staff).toBe(true);
    expect(result.moderator).toBe(false);
  });

  it('normalizes Pleroma favicon', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);

    expect(result.favicon).toEqual('https://gleasonator.com/favicon.png');
  });

  it('adds account domain', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');
    const result = normalizeAccount(account);

    expect(result.domain).toEqual('gleasonator.com');
  });
});
