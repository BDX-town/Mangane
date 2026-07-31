/**
 * Phase 8D — Content classifier tests.
 */

import { classifyContent, canAuthorFormat } from '../content-classifier';

describe('classifyContent', () => {
  it('classifies explicit content_type as markdown', () => {
    const result = classifyContent({
      content: '<p>Hello</p>',
      content_type: 'text/markdown',
      text: '# Hello',
    });
    expect(result.format).toBe('markdown');
    expect(result.authority).toBe('explicit-content-type');
    expect(result.sourceIsAuthoritative).toBe(true);
  });

  it('classifies explicit content_type as plain text', () => {
    const result = classifyContent({
      content: 'Hello world',
      content_type: 'text/plain',
    });
    expect(result.format).toBe('plain-text');
    expect(result.authority).toBe('explicit-content-type');
  });

  it('classifies MFM content type', () => {
    const result = classifyContent({
      content: '<p>Hello</p>',
      content_type: 'text/x.misskeymarkdown',
      text: '**Hello**',
    });
    expect(result.format).toBe('misskey-mfm');
  });

  it('detects Misskey via payload indicators (not text scanning)', () => {
    const result = classifyContent({
      content: '<p>Hello</p>',
      text: '$[spin Hello]', // Has MFM syntax but we detect via indicators
      reactionAcceptance: 'likeOnly', // Misskey-specific field
    });
    expect(result.format).toBe('misskey-mfm');
    expect(result.authority).toBe('documented-contract');
    expect(result.sourceText).toBe('$[spin Hello]');
  });

  it('does NOT infer MFM from text content alone', () => {
    const result = classifyContent({
      content: '<p>$[spin Hello]</p>',
      // No text field, no Misskey indicators
    });
    expect(result.format).toBe('html'); // Safe default
    expect(result.format).not.toBe('misskey-mfm');
  });

  it('uses Pleroma/Akkoma content_type from pleroma field', () => {
    const result = classifyContent({
      content: '<p>Test</p>',
      pleroma: { content_type: 'text/markdown', source: '# Test' },
    });
    expect(result.format).toBe('markdown');
    expect(result.sourceText).toBe('# Test');
  });

  it('falls back to html when only content is available', () => {
    const result = classifyContent({
      content: '<p>Just HTML</p>',
    });
    expect(result.format).toBe('html');
    expect(result.authority).toBe('inferred-from-html');
    expect(result.sourceIsAuthoritative).toBe(false);
  });

  it('falls back to plain-text when nothing is available', () => {
    const result = classifyContent({
      text: 'Plain text only',
    });
    expect(result.format).toBe('plain-text');
    expect(result.authority).toBe('unavailable');
  });

  it('uses source field content_type', () => {
    const result = classifyContent({
      content: '<p>Edited</p>',
      source: { text: '**Edited**', content_type: 'text/markdown' },
    });
    expect(result.format).toBe('markdown');
    expect(result.authority).toBe('documented-contract');
    expect(result.sourceText).toBe('**Edited**');
  });

  it('handles unknown content_type gracefully', () => {
    const result = classifyContent({
      content: '<p>Unknown</p>',
      content_type: 'application/x-custom',
    });
    // Falls through to next classification method
    expect(result.format).toBe('html');
  });
});

describe('canAuthorFormat', () => {
  it('plain-text is always available', () => {
    expect(canAuthorFormat('plain-text', {})).toBe(true);
  });

  it('markdown requires capability', () => {
    expect(canAuthorFormat('markdown', {})).toBe(false);
    expect(canAuthorFormat('markdown', { markdownAuthoring: true })).toBe(true);
  });

  it('MFM requires capability', () => {
    expect(canAuthorFormat('misskey-mfm', {})).toBe(false);
    expect(canAuthorFormat('misskey-mfm', { mfmAuthoring: true })).toBe(true);
  });

  it('unknown format returns false', () => {
    expect(canAuthorFormat('unknown', {})).toBe(false);
  });
});
