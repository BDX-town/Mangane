import { sanitizeHtml, safeHtml } from '../html-safety';

describe('sanitizeHtml', () => {
  const adversarialPayloads = [
    '<script>alert(1)</script><p>safe</p>',
    '<img src="https://cdn.example/ok.png" onerror="alert(1)">',
    '<a href="javascript:alert(1)">click</a>',
    '<a href="&#x6a;avascript:alert(1)">encoded</a>',
    '<svg><g onload="alert(1)"></g></svg>',
    '<math><mtext><img src=x onerror=alert(1)></mtext></math>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    '<form action="https://evil.example"><button formaction="https://evil.example">go</button></form>',
    '<div style="background:url(javascript:alert(1))">styled</div>',
    '<template><img src=x onerror=alert(1)></template>',
    '<p><svg><style><img src=x onerror=alert(1)></style></svg></p>',
  ];

  it.each(adversarialPayloads)('removes executable markup from %s', payload => {
    const result = sanitizeHtml(payload);

    expect(result).not.toMatch(/<script|<svg|<math|<iframe|<form|<template/i);
    expect(result).not.toMatch(/\son\w+\s*=|javascript:|srcdoc=|formaction=|\sstyle=/i);
  });

  it('keeps bounded rich text and hardens external links', () => {
    const result = sanitizeHtml('<p>Hello <strong>world</strong> <a href="https://example.com/path">link</a></p>');
    const container = document.createElement('div');
    container.innerHTML = result;
    const link = container.querySelector('a');

    expect(container.querySelector('strong')?.textContent).toBe('world');
    expect(link?.getAttribute('href')).toBe('https://example.com/path');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('nofollow noopener noreferrer ugc');
  });

  it('blocks dangerous and unsupported resource schemes', () => {
    const result = sanitizeHtml([
      '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
      '<img src="blob:https://example.com/id">',
      '<a href="vbscript:msgbox(1)">bad</a>',
    ].join(''));
    const container = document.createElement('div');
    container.innerHTML = result;

    expect([...container.querySelectorAll('img')].every(image => !image.hasAttribute('src'))).toBe(true);
    expect(container.querySelector('a')?.hasAttribute('href')).toBe(false);
  });

  it('uses a restricted tag set for inline text', () => {
    const result = sanitizeHtml('<p>block</p><span data-user="1">inline</span><img src="https://example.com/e.png">', 'inline-text');

    expect(result).not.toContain('<p>');
    expect(result).not.toContain('data-user');
    expect(result).toContain('<span>inline</span>');
    expect(result).toContain('<img src="https://example.com/e.png">');
  });

  it('fails closed for non-string values', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml({ html: '<b>unsafe</b>' })).toBe('');
    expect(safeHtml(undefined)).toEqual({ __html: '' });
  });
});
