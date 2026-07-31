/**
 * Phase 8D — Content pipeline tests.
 * Tests parser limits, sanitizer passthrough, MFM handling, and security.
 */

import { processContent } from '../content-pipeline';
import { DEFAULT_PARSER_LIMITS } from '../content-types';

// Simple sanitizer mock (strips dangerous tags but preserves safe ones)
const mockSanitize = (html: string): string => {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
};

describe('processContent', () => {
  describe('HTML content (most common path)', () => {
    it('passes server-rendered HTML through sanitizer', () => {
      const result = processContent({ content: '<p>Hello <strong>world</strong></p>' }, mockSanitize);
      expect(result.safeHtml).toContain('Hello');
      expect(result.safeHtml).toContain('<strong>world</strong>');
      expect(result.processedFormat).toBe('html');
      expect(result.fromAuthoritativeSource).toBe(false);
    });

    it('strips script tags via sanitizer', () => {
      const result = processContent(
        { content: '<p>Safe</p><script>alert(1)</script>' },
        mockSanitize,
      );
      expect(result.safeHtml).not.toContain('<script>');
      expect(result.safeHtml).toContain('Safe');
    });
  });

  describe('Markdown content', () => {
    it('renders bold markdown', () => {
      const result = processContent(
        { content: '', content_type: 'text/markdown', text: '**bold text**' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('<strong>bold text</strong>');
      expect(result.processedFormat).toBe('markdown');
      expect(result.fromAuthoritativeSource).toBe(true);
    });

    it('renders inline code', () => {
      const result = processContent(
        { content: '', content_type: 'text/markdown', text: 'Use `console.log`' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('<code>console.log</code>');
    });

    it('renders strikethrough', () => {
      const result = processContent(
        { content: '', content_type: 'text/markdown', text: '~~deleted~~' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('<del>deleted</del>');
    });
  });

  describe('MFM content', () => {
    it('renders supported MFM center', () => {
      const result = processContent(
        { content: '', content_type: 'text/x.misskeymarkdown', text: '$[center Hello]' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('text-align:center');
      expect(result.safeHtml).toContain('Hello');
    });

    it('renders supported MFM small', () => {
      const result = processContent(
        { content: '', content_type: 'text/x.misskeymarkdown', text: '$[small tiny text]' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('<small>tiny text</small>');
    });

    it('safely degrades unsupported spin animation', () => {
      const result = processContent(
        { content: '', content_type: 'text/x.misskeymarkdown', text: '$[spin rotating]' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('rotating'); // Content preserved
      expect(result.safeHtml).not.toContain('spin'); // Effect removed
      expect(result.degradedConstructs).toContain('spin');
      expect(result.hasMotionEffects).toBe(true);
    });

    it('safely degrades color constructs', () => {
      const result = processContent(
        { content: '', content_type: 'text/x.misskeymarkdown', text: '$[fg.color=ff0000 red text]' },
        mockSanitize,
      );
      expect(result.safeHtml).toContain('red text');
      expect(result.degradedConstructs).toContain('fg');
    });
  });

  describe('parser limits', () => {
    it('truncates input exceeding maxInputBytes', () => {
      const longInput = 'x'.repeat(200_000);
      const result = processContent(
        { content: '', content_type: 'text/markdown', text: longInput },
        mockSanitize,
      );
      expect(result.safeHtml.length).toBeLessThan(200_000);
      expect(result.degradedConstructs).toContain('input-truncated');
    });

    it('truncates output exceeding maxOutputLength', () => {
      // Create content that would expand significantly
      const limits = { ...DEFAULT_PARSER_LIMITS, maxOutputLength: 100 };
      const result = processContent(
        { content: 'x'.repeat(200) },
        mockSanitize,
        limits,
      );
      expect(result.safeHtml.length).toBeLessThanOrEqual(101); // 100 + '…'
    });
  });

  describe('security', () => {
    it('escapes HTML in markdown source', () => {
      const result = processContent(
        { content: '', content_type: 'text/markdown', text: '<script>alert(1)</script>' },
        mockSanitize,
      );
      expect(result.safeHtml).not.toContain('<script>');
      expect(result.safeHtml).toContain('&lt;script&gt;');
    });

    it('escapes HTML in MFM source', () => {
      const result = processContent(
        { content: '', content_type: 'text/x.misskeymarkdown', text: '<img onerror=alert(1)>' },
        mockSanitize,
      );
      // The HTML is escaped so it renders as text, not executable
      expect(result.safeHtml).toContain('&lt;img');
      expect(result.safeHtml).not.toContain('<img');
    });

    it('escapes HTML in plain text', () => {
      const result = processContent(
        { text: '<div onclick="steal()">Click</div>' },
        mockSanitize,
      );
      // Escaped to prevent execution
      expect(result.safeHtml).toContain('&lt;div');
      expect(result.safeHtml).not.toContain('<div');
    });
  });
});
