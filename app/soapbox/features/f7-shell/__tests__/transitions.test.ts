import { getTransitionConfig, getTransitionCssVars } from '../transitions';

describe('F7 Shell Transitions', () => {
  describe('getTransitionConfig', () => {
    it('returns standard duration when reduced motion is off', () => {
      const config = getTransitionConfig(false);
      expect(config.animate).toBe(true);
      expect(config.duration).toBe(300);
      expect(config.easing).toContain('cubic-bezier');
    });

    it('returns near-instant duration when reduced motion is on', () => {
      const config = getTransitionConfig(true);
      expect(config.animate).toBe(true);
      expect(config.duration).toBe(1);
      expect(config.easing).toBe('linear');
    });
  });

  describe('getTransitionCssVars', () => {
    it('returns CSS custom properties for standard motion', () => {
      const vars = getTransitionCssVars(false);
      expect(vars['--f7-page-transition-duration']).toBe('300ms');
      expect(vars['--f7-page-transition-easing']).toContain('cubic-bezier');
    });

    it('returns near-instant CSS properties for reduced motion', () => {
      const vars = getTransitionCssVars(true);
      expect(vars['--f7-page-transition-duration']).toBe('1ms');
      expect(vars['--f7-page-transition-easing']).toBe('linear');
    });
  });
});
