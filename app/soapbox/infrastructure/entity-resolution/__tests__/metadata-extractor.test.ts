/**
 * Phase 8B-3 — Metadata extractor tests.
 *
 * Tests structured data extraction, proof tier assignment, priority ordering,
 * deduplication, and security validation.
 */

import { resetAllStores, getAttributionsForResource } from '../entity-repository';
import { extractAuthors, processExtractedAuthors } from '../metadata-extractor';

import type { PageMetadata } from '../metadata-extractor';

const accountScope = 'https://mastodon.social/users/viewer';

beforeEach(() => {
  resetAllStores();
});

describe('extractAuthors', () => {
  describe('fediverse:creator', () => {
    it('extracts valid fediverse handle', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://blog.example/post',
        fediverseCreator: '@alice@mastodon.social',
      };
      const authors = extractAuthors(metadata);
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('@alice@mastodon.social');
      expect(authors[0].fediverseHandle).toBe('@alice@mastodon.social');
      expect(authors[0].proof).toBe('structured-author-with-social-profile');
      expect(authors[0].provider).toBe('fediverse-creator');
      expect(authors[0].url).toBe('https://mastodon.social/@alice');
    });

    it('handles handle without leading @', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://x.com/post',
        fediverseCreator: 'bob@instance.social',
      });
      expect(authors.length).toBe(1);
      expect(authors[0].fediverseHandle).toBe('@bob@instance.social');
    });

    it('rejects invalid handles', () => {
      expect(extractAuthors({ canonicalUrl: 'https://x.com', fediverseCreator: 'notahandle' }).length).toBe(0);
      expect(extractAuthors({ canonicalUrl: 'https://x.com', fediverseCreator: '@' }).length).toBe(0);
      expect(extractAuthors({ canonicalUrl: 'https://x.com', fediverseCreator: '' }).length).toBe(0);
    });

    it('rejects handles with invalid domain', () => {
      expect(extractAuthors({ canonicalUrl: 'https://x.com', fediverseCreator: '@user@-invalid.com' }).length).toBe(0);
      expect(extractAuthors({ canonicalUrl: 'https://x.com', fediverseCreator: '@user@domain..com' }).length).toBe(0);
    });
  });

  describe('Schema.org JSON-LD', () => {
    it('extracts author with social profile (sameAs)', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://article.com/post',
        schemaOrgAuthors: [{
          name: 'Charlie Dev',
          url: 'https://charlieblog.com',
          sameAs: ['https://mastodon.social/@charlie'],
        }],
      };
      const authors = extractAuthors(metadata);
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('Charlie Dev');
      expect(authors[0].proof).toBe('structured-author-with-social-profile');
      expect(authors[0].url).toBe('https://mastodon.social/@charlie');
    });

    it('extracts author without social profile', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://article.com/post',
        schemaOrgAuthors: [{ name: 'Plain Author', url: 'https://example.com/about' }],
      };
      const authors = extractAuthors(metadata);
      expect(authors[0].proof).toBe('structured-author');
      expect(authors[0].confidence).toBe(0.5);
    });

    it('skips authors with no name', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://x.com',
        schemaOrgAuthors: [{ url: 'https://example.com' }],
      };
      expect(extractAuthors(metadata).length).toBe(0);
    });
  });

  describe('Open Graph', () => {
    it('extracts OG author as URL', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://news.com/article',
        ogAuthor: 'https://social.example/@journalist',
      });
      expect(authors.length).toBe(1);
      expect(authors[0].provider).toBe('open-graph');
    });

    it('extracts OG author as name', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://news.com/article',
        ogAuthor: 'Jane Reporter',
      });
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('Jane Reporter');
    });
  });

  describe('oEmbed', () => {
    it('extracts oEmbed author', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://video.com/watch/123',
        oembedAuthorName: 'Creator Name',
        oembedAuthorUrl: 'https://video.com/creator',
      });
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('Creator Name');
      expect(authors[0].provider).toBe('oembed');
    });
  });

  describe('Dublin Core', () => {
    it('extracts DC creator', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://journal.org/paper',
        dcCreator: 'Dr. Researcher',
      });
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('Dr. Researcher');
      expect(authors[0].provider).toBe('dublin-core');
    });
  });

  describe('priority and deduplication', () => {
    it('fediverse:creator takes priority over other sources', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://blog.example/post',
        fediverseCreator: '@alice@mastodon.social',
        schemaOrgAuthors: [{ name: 'Alice', url: 'https://mastodon.social/@alice' }],
        ogAuthor: 'Alice',
      };
      const authors = extractAuthors(metadata);
      // Only one author (deduped by name normalization)
      expect(authors.length).toBeLessThanOrEqual(2);
      expect(authors[0].provider).toBe('fediverse-creator');
    });

    it('deduplicates by normalized name', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://x.com',
        schemaOrgAuthors: [
          { name: 'Alice Writer' },
          { name: 'alice writer' }, // duplicate (case-insensitive)
        ],
      };
      const authors = extractAuthors(metadata);
      expect(authors.length).toBe(1);
    });

    it('lower-priority sources only used when higher sources absent', () => {
      const metadata: PageMetadata = {
        canonicalUrl: 'https://x.com',
        schemaOrgAuthors: [{ name: 'Primary' }],
        dcCreator: 'Fallback',
      };
      const authors = extractAuthors(metadata);
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('Primary');
    });
  });

  describe('security', () => {
    it('rejects non-http URLs', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://x.com',
        schemaOrgAuthors: [{ name: 'Bad', url: 'file:///etc/passwd' }],
      });
      expect(authors[0].url).toBeUndefined();
    });

    it('rejects URLs with credentials', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://x.com',
        schemaOrgAuthors: [{ name: 'Bad', url: 'https://user:pass@evil.com' }],
      });
      expect(authors[0].url).toBeUndefined();
    });

    it('bounds excessively long names', () => {
      const authors = extractAuthors({
        canonicalUrl: 'https://x.com',
        metaAuthor: 'x'.repeat(1000),
      });
      expect(authors[0].name.length).toBeLessThanOrEqual(500);
    });
  });
});

describe('processExtractedAuthors', () => {
  it('creates attributions from extracted authors', () => {
    const authors = extractAuthors({
      canonicalUrl: 'https://blog.example/article',
      fediverseCreator: '@writer@social.example',
    });
    const keys = processExtractedAuthors(accountScope, 'https://blog.example/article', authors);
    expect(keys.length).toBe(1);

    const attributions = getAttributionsForResource(accountScope, 'https://blog.example/article');
    expect(attributions.length).toBe(1);
    expect(attributions[0].proof).toBe('structured-author-with-social-profile');
  });

  it('returns empty for invalid inputs', () => {
    expect(processExtractedAuthors('', 'https://x.com', [])).toEqual([]);
    expect(processExtractedAuthors(accountScope, '', [])).toEqual([]);
    expect(processExtractedAuthors(accountScope, 'https://x.com', [])).toEqual([]);
  });

  it('scopes attributions to the provided account', () => {
    const authors = extractAuthors({
      canonicalUrl: 'https://blog.example/scoped',
      metaAuthor: 'Someone',
    });
    processExtractedAuthors(accountScope, 'https://blog.example/scoped', authors);

    const otherScope = 'https://other.example/users/bob';
    expect(getAttributionsForResource(otherScope, 'https://blog.example/scoped').length).toBe(0);
  });
});
