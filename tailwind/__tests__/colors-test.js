import {
  withOpacityValue,
  parseColorMatrix,
} from '../colors';

describe('withOpacityValue()', () => {
  it('returns a Tailwind color function with alpha support', () => {
    const result = withOpacityValue('--color-primary-500');

    // It returns a function
    expect(typeof result).toBe('function');

    // Test calling the function
    expect(result({})).toBe('rgb(var(--color-primary-500))');
    expect(result({ opacityValue: .5 })).toBe('rgb(var(--color-primary-500) / 0.5)');
  });
});

describe('parseColorMatrix()', () => {
  it('returns a Tailwind color object', () => {
    const colorMatrix = {
      gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      danger: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      accent: [300, 500],
    };

    const result = parseColorMatrix(colorMatrix);

    // Colors are mapped to functions which return CSS values
    expect(result.primary[500]({})).toEqual('rgb(var(--color-primary-500))');
    expect(result.accent[300]({ opacityValue: .3 })).toEqual('rgb(var(--color-accent-300) / 0.3)');
  });

  it('parses single-tint values', () => {
    const colorMatrix = {
      gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      danger: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      accent: [300, 500],
      'gradient-start': true,
      'gradient-end': true,
      'sea-blue': true,
    };

    const result = parseColorMatrix(colorMatrix);

    expect(result['sea-blue']({})).toEqual('rgb(var(--color-sea-blue))');
    expect(result['gradient-start']({ opacityValue: .7 })).toEqual('rgb(var(--color-gradient-start) / 0.7)');
  });
});
