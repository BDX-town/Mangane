import * as html from '../html';

describe('html', () => {
  describe('unescapeHTML', () => {
    it('returns unescaped HTML', () => {
      const output = html.unescapeHTML('<p>lorem</p><p>ipsum</p><br>&lt;br&gt;');
      expect(output).toEqual('lorem\n\nipsum\n<br>');
    });
  });

  describe('stripCompatibilityFeatures', () => {
    it('is only a transformer and does not remove executable markup', () => {
      const output = html.stripCompatibilityFeatures('<script>alert(1)</script><p>safe</p>');
      expect(output).toContain('<script>alert(1)</script>');
    });
  });
});
