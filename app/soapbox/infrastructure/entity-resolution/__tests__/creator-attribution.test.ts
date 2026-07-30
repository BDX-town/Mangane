/**
 * Phase 8B-2 — Creator attribution tests.
 *
 * Tests native Mastodon author processing, legacy fallback,
 * entity creation, proof tier assignment, and security validation.
 */

import { processCardAttribution } from '../creator-attribution';
import { resetAllStores, getAttributionsForResource, getEntity } from '../entity-repository';

import type { PreviewCardInput } from '../creator-attribution';

const accountScope = 'https://mastodon.social/users/viewer';

beforeEach(() => {
  resetAllStores();
});

describe('processCardAttribution', () => {
  describe('input validation', () => {
    it('returns empty for missing accountScope', () => {
      expect(processCardAttribution('', { url: 'https://example.com/article' })).toEqual([]);
    });

    it('returns empty for missing card URL', () => {
      expect(processCardAttribution(accountScope, { url: '' })).toEqual([]);
    });

    it('returns empty for invalid card URL', () => {
      expect(processCardAttribution(accountScope, { url: 'file:///etc/passwd' })).toEqual([]);
    });

    it('returns empty for URL with credentials', () => {
      expect(processCardAttribution(accountScope, { url: 'https://user:pass@example.com/x' })).toEqual([]);
    });
  });

  describe('native Mastodon authors[]', () => {
    it('processes a single native author with resolved account', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/article-1',
        authors: [{
          name: 'Alice Writer',
          url: 'https://mastodon.social/@alice',
          account: {
            id: '12345',
            acct: 'alice',
            url: 'https://mastodon.social/@alice',
            username: 'alice',
            display_name: 'Alice Writer',
          },
        }],
      };

      const keys = processCardAttribution(accountScope, card);
      expect(keys.length).toBe(1);

      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/article-1');
      expect(attributions.length).toBe(1);
      expect(attributions[0].proof).toBe('native-server-verified');
      expect(attributions[0].localAccountId).toBe('12345');
      expect(attributions[0].canonicalAccountUri).toBe('https://mastodon.social/@alice');
    });

    it('processes multiple authors in order', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/collab',
        authors: [
          { name: 'First Author', url: 'https://instance.social/@first' },
          { name: 'Second Author', url: 'https://instance.social/@second' },
        ],
      };

      const keys = processCardAttribution(accountScope, card);
      expect(keys.length).toBe(2);

      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/collab');
      expect(attributions[0].ordinal).toBe(0);
      expect(attributions[1].ordinal).toBe(1);
    });

    it('assigns structured-author-with-social-profile for URL without account', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/post',
        authors: [{ name: 'Bob', url: 'https://mastodon.social/@bob' }],
      };

      processCardAttribution(accountScope, card);
      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/post');
      expect(attributions[0].proof).toBe('structured-author-with-social-profile');
    });

    it('skips authors with no useful data', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/empty',
        authors: [{}],
      };

      const keys = processCardAttribution(accountScope, card);
      expect(keys.length).toBe(0);
    });

    it('caps authors at MAX_AUTHORS (20)', () => {
      const authors = Array.from({ length: 25 }, (_, i) => ({ name: `Author ${i}` }));
      const card: PreviewCardInput = {
        url: 'https://blog.example/many',
        authors,
      };

      const keys = processCardAttribution(accountScope, card);
      expect(keys.length).toBeLessThanOrEqual(20);
    });
  });

  describe('legacy fallback', () => {
    it('uses author_name when no authors[] present', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/legacy',
        author_name: 'Legacy Author',
        author_url: 'https://instance.social/@legacy',
      };

      const keys = processCardAttribution(accountScope, card);
      expect(keys.length).toBe(1);

      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/legacy');
      expect(attributions[0].proof).toBe('structured-author-with-social-profile');
    });

    it('falls back to metadata-author when URL is not fediverse', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/non-fedi',
        author_name: 'Normal Author',
        author_url: 'https://normalblog.com/about',
      };

      processCardAttribution(accountScope, card);
      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/non-fedi');
      expect(attributions[0].proof).toBe('metadata-author');
    });

    it('does not use legacy when authors[] is present', () => {
      const card: PreviewCardInput = {
        url: 'https://blog.example/both',
        author_name: 'Legacy Name',
        authors: [{ name: 'Native Author' }],
      };

      processCardAttribution(accountScope, card);
      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/both');
      // Should use native, not legacy
      expect(attributions.length).toBe(1);
    });
  });

  describe('entity creation', () => {
    it('creates a canonical entity for each unique creator', () => {
      processCardAttribution(accountScope, {
        url: 'https://blog.example/e1',
        authors: [{ name: 'New Creator', url: 'https://social.example/@new' }],
      });

      const attributions = getAttributionsForResource(accountScope, 'https://blog.example/e1');
      const entity = getEntity(attributions[0].creatorEntityId);
      expect(entity).toBeDefined();
      expect(entity!.preferredLabel).toBe('New Creator');
      expect(entity!.kind).toBe('person');
    });

    it('reuses entity for same canonical URI', () => {
      processCardAttribution(accountScope, {
        url: 'https://blog.example/a',
        authors: [{ name: 'Alice', url: 'https://social.example/@alice', account: { id: '1', url: 'https://social.example/@alice' } }],
      });
      processCardAttribution(accountScope, {
        url: 'https://blog.example/b',
        authors: [{ name: 'Alice Writer', url: 'https://social.example/@alice', account: { id: '1', url: 'https://social.example/@alice' } }],
      });

      const attrA = getAttributionsForResource(accountScope, 'https://blog.example/a');
      const attrB = getAttributionsForResource(accountScope, 'https://blog.example/b');
      expect(attrA[0].creatorEntityId).toBe(attrB[0].creatorEntityId);
    });
  });

  describe('account scope isolation', () => {
    it('attributions are scoped to the viewer account', () => {
      processCardAttribution(accountScope, {
        url: 'https://blog.example/scoped',
        authors: [{ name: 'Creator' }],
      });

      const otherScope = 'https://mastodon.social/users/other';
      const otherResults = getAttributionsForResource(otherScope, 'https://blog.example/scoped');
      expect(otherResults.length).toBe(0);
    });
  });
});
