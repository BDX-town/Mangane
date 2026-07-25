import { installNavigationPolicy } from '../navigation-policy';

describe('navigation policy', () => {
  let cleanup: () => void;

  beforeEach(() => {
    document.body.innerHTML = '';
    cleanup = installNavigationPolicy();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('blocks an unsafe destination synchronously', () => {
    const anchor = document.createElement('a');
    anchor.href = 'javascript:alert(1)';
    document.body.append(anchor);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(anchor.dispatchEvent(event)).toBe(false);
    expect(anchor.hasAttribute('href')).toBe(false);
  });

  it('self-heals dynamically inserted unsafe anchors', async() => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'data:text/html,<script>alert(1)</script>');
    document.body.append(anchor);
    await Promise.resolve();

    expect(anchor.hasAttribute('href')).toBe(false);
  });

  it('hardens new-tab anchors without changing safe destinations', async() => {
    const anchor = document.createElement('a');
    anchor.href = 'https://example.com/path';
    anchor.target = '_blank';
    document.body.append(anchor);
    await Promise.resolve();

    expect(anchor.href).toBe('https://example.com/path');
    expect(anchor.rel.split(' ')).toEqual(expect.arrayContaining(['nofollow', 'noopener', 'noreferrer']));
  });
});
