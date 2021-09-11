import emojify from '../emoji';

describe('emoji', () => {
  describe('.emojify', () => {
    it('ignores unknown shortcodes', () => {
      expect(emojify(':foobarbazfake:')).toEqual(':foobarbazfake:');
    });

    it('ignores shortcodes inside of tags', () => {
      expect(emojify('<p data-foo=":smile:"></p>')).toEqual('<p data-foo=":smile:"></p>');
    });

    it('works with unclosed tags', () => {
      expect(emojify('hello>')).toEqual('hello>');
      expect(emojify('<hello')).toEqual('<hello');
    });

    it('works with unclosed shortcodes', () => {
      expect(emojify('smile:')).toEqual('smile:');
      expect(emojify(':smile')).toEqual(':smile');
    });

    it('does unicode', () => {
      expect(emojify('\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66')).toEqual(
        '<img draggable="false" class="emojione" alt="👩‍👩‍👦‍👦" title=":woman-woman-boy-boy:" src="[object Object]" />');
      expect(emojify('👨‍👩‍👧‍👧')).toEqual(
        '<img draggable="false" class="emojione" alt="👨‍👩‍👧‍👧" title=":man-woman-girl-girl:" src="[object Object]" />');
      expect(emojify('👩‍👩‍👦')).toEqual('<img draggable="false" class="emojione" alt="👩‍👩‍👦" title=":woman-woman-boy:" src="[object Object]" />');
      expect(emojify('\u2757')).toEqual(
        '<img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" />');
    });

    it('does multiple unicode', () => {
      expect(emojify('\u2757 #\uFE0F\u20E3')).toEqual(
        '<img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" /> <img draggable="false" class="emojione" alt="#️⃣" title=":hash:" src="[object Object]" />');
      expect(emojify('\u2757#\uFE0F\u20E3')).toEqual(
        '<img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" /><img draggable="false" class="emojione" alt="#️⃣" title=":hash:" src="[object Object]" />');
      expect(emojify('\u2757 #\uFE0F\u20E3 \u2757')).toEqual(
        '<img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" /> <img draggable="false" class="emojione" alt="#️⃣" title=":hash:" src="[object Object]" /> <img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" />');
      expect(emojify('foo \u2757 #\uFE0F\u20E3 bar')).toEqual(
        'foo <img draggable="false" class="emojione" alt="❗" title=":exclamation:" src="[object Object]" /> <img draggable="false" class="emojione" alt="#️⃣" title=":hash:" src="[object Object]" /> bar');
    });

    it('ignores unicode inside of tags', () => {
      expect(emojify('<p data-foo="\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66"></p>')).toEqual('<p data-foo="\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66"></p>');
    });

    it('does multiple emoji properly (issue 5188)', () => {
      expect(emojify('👌🌈💕')).toEqual('<img draggable="false" class="emojione" alt="👌" title=":ok_hand:" src="[object Object]" /><img draggable="false" class="emojione" alt="🌈" title=":rainbow:" src="[object Object]" /><img draggable="false" class="emojione" alt="💕" title=":two_hearts:" src="[object Object]" />');
      expect(emojify('👌 🌈 💕')).toEqual('<img draggable="false" class="emojione" alt="👌" title=":ok_hand:" src="[object Object]" /> <img draggable="false" class="emojione" alt="🌈" title=":rainbow:" src="[object Object]" /> <img draggable="false" class="emojione" alt="💕" title=":two_hearts:" src="[object Object]" />');
    });

    it('does an emoji that has no shortcode', () => {
      expect(emojify('👁‍🗨')).toEqual('<img draggable="false" class="emojione" alt="👁‍🗨" title="" src="[object Object]" />');
    });

    it('does an emoji whose filename is irregular', () => {
      expect(emojify('↙️')).toEqual('<img draggable="false" class="emojione" alt="↙️" title=":arrow_lower_left:" src="[object Object]" />');
    });

    it('avoid emojifying on invisible text', () => {
      expect(emojify('<a href="http://example.com/test%F0%9F%98%84"><span class="invisible">http://</span><span class="ellipsis">example.com/te</span><span class="invisible">st😄</span></a>'))
        .toEqual('<a href="http://example.com/test%F0%9F%98%84"><span class="invisible">http://</span><span class="ellipsis">example.com/te</span><span class="invisible">st😄</span></a>');
      expect(emojify('<span class="invisible">:luigi:</span>', { ':luigi:': { static_url: 'luigi.exe' } }))
        .toEqual('<span class="invisible">:luigi:</span>');
    });

    it('avoid emojifying on invisible text with nested tags', () => {
      expect(emojify('<span class="invisible">😄<span class="foo">bar</span>😴</span>😇'))
        .toEqual('<span class="invisible">😄<span class="foo">bar</span>😴</span><img draggable="false" class="emojione" alt="😇" title=":innocent:" src="[object Object]" />');
      expect(emojify('<span class="invisible">😄<span class="invisible">😕</span>😴</span>😇'))
        .toEqual('<span class="invisible">😄<span class="invisible">😕</span>😴</span><img draggable="false" class="emojione" alt="😇" title=":innocent:" src="[object Object]" />');
      expect(emojify('<span class="invisible">😄<br/>😴</span>😇'))
        .toEqual('<span class="invisible">😄<br/>😴</span><img draggable="false" class="emojione" alt="😇" title=":innocent:" src="[object Object]" />');
    });

    it('skips the textual presentation VS15 character', () => {
      expect(emojify('✴︎')) // This is U+2734 EIGHT POINTED BLACK STAR then U+FE0E VARIATION SELECTOR-15
        .toEqual('<img draggable="false" class="emojione" alt="✴" title=":eight_pointed_black_star:" src="[object Object]" />');
    });
  });
});
