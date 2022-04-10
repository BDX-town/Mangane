import { rootState } from '../../jest/test-helpers';
import { getSoapboxConfig } from '../soapbox';

const ASCII_HEART = '❤'; // '\u2764\uFE0F'
const RED_HEART_RGI = '❤️'; // '\u2764'

describe('getSoapboxConfig()', () => {
  it('returns RGI heart on Pleroma > 2.3', () => {
    const state = rootState.setIn(['instance', 'version'], '2.7.2 (compatible; Pleroma 2.3.0)');
    expect(getSoapboxConfig(state).allowedEmoji.includes(RED_HEART_RGI)).toBe(true);
    expect(getSoapboxConfig(state).allowedEmoji.includes(ASCII_HEART)).toBe(false);
  });

  it('returns an ASCII heart on Pleroma < 2.3', () => {
    const state = rootState.setIn(['instance', 'version'], '2.7.2 (compatible; Pleroma 2.0.0)');
    expect(getSoapboxConfig(state).allowedEmoji.includes(ASCII_HEART)).toBe(true);
    expect(getSoapboxConfig(state).allowedEmoji.includes(RED_HEART_RGI)).toBe(false);
  });
});
