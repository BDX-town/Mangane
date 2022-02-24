import { fromJS } from 'immutable';

import { normalizeStatus } from '../status';

describe('normalizeStatus', () => {
  it('adds base fields', () => {
    const status = fromJS({});
    const result = normalizeStatus(status);

    expect(result.get('emojis')).toEqual(fromJS([]));
    expect(result.get('favourites_count')).toBe(0);
    expect(result.get('mentions')).toEqual(fromJS([]));
    expect(result.get('reblog')).toBe(null);
    expect(result.get('uri')).toBe('');
    expect(result.get('visibility')).toBe('public');
  });

  it('fixes the order of mentions', () => {
    const status = fromJS(require('soapbox/__fixtures__/status-unordered-mentions.json'));

    const expected = ['NEETzsche', 'alex', 'Lumeinshin', 'sneeden'];

    const result = normalizeStatus(status)
      .get('mentions')
      .map(mention => mention.get('username'))
      .toJS();

    expect(result).toEqual(expected);
  });

  it('adds mention to self in self-reply on Mastodon', () => {
    const status = fromJS(require('soapbox/__fixtures__/mastodon-reply-to-self.json'));

    const expected = fromJS([{
      id: '106801667066418367',
      username: 'benis911',
      acct: 'benis911',
      url: 'https://mastodon.social/@benis911',
    }]);

    const result = normalizeStatus(status).get('mentions');

    expect(result).toEqual(expected);
  });

  it('normalizes mentions with only acct', () => {
    const status = fromJS({ mentions: [{ acct: 'alex@gleasonator.com' }] });

    const expected = fromJS([{
      acct: 'alex@gleasonator.com',
      username: 'alex',
      url: '',
    }]);

    const result = normalizeStatus(status).get('mentions');

    expect(result).toEqual(expected);
  });

  it('normalizes Mitra attachments', () => {
    const status = fromJS(require('soapbox/__fixtures__/mitra-status-with-attachments.json'));

    const expected = fromJS([{
      id: '017eeb0e-e5df-30a4-77a7-a929145cb836',
      type: 'image',
      url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
      preview_url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
      remote_url: 'https://mitra.social/media/8e04e6091bbbac79641b5812508683ce72c38693661c18d16040553f2371e18d.png',
    }, {
      id: '017eeb0e-e5e4-2a48-2889-afdebf368a54',
      type: 'unknown',
      url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
      preview_url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
      remote_url: 'https://mitra.social/media/8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac',
    }, {
      id: '017eeb0e-e5e5-79fd-6054-8b6869b1db49',
      type: 'unknown',
      url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
      preview_url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
      remote_url: 'https://mitra.social/media/55a81a090247cc4fc127e5716bcf7964f6e0df9b584f85f4696c0b994747a4d0.oga',
    }, {
      id: '017eeb0e-e5e6-c416-a444-21e560c47839',
      type: 'unknown',
      url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
      preview_url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
      remote_url: 'https://mitra.social/media/0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
    }]);

    const result = normalizeStatus(status);

    expect(result.get('media_attachments')).toEqual(expected);
  });

  it('leaves Pleroma attachments alone', () => {
    const status = fromJS(require('soapbox/__fixtures__/pleroma-status-with-attachments.json'));
    const result = normalizeStatus(status);

    expect(status.get('media_attachments')).toEqual(result.get('media_attachments'));
  });

  it('normalizes Pleroma quote post', () => {
    const status = fromJS(require('soapbox/__fixtures__/pleroma-quote-post.json'));
    const result = normalizeStatus(status);

    expect(result.get('quote')).toEqual(status.getIn(['pleroma', 'quote']));
    expect(result.getIn(['pleroma', 'quote'])).toBe(undefined);
  });
});
