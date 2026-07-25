import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { render } from 'soapbox/jest/test-helpers';
import { normalizeCard } from 'soapbox/normalizers';

import Card from '../card';

describe('<Card /> HTML and destination safety', () => {
  const onOpenMedia = jest.fn();

  beforeEach(() => {
    jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    onOpenMedia.mockReset();
  });

  it('does not insert remote provider HTML and opens the classified provider URL', () => {
    const card = normalizeCard({
      type: 'video',
      url: 'https://video.example/watch/1',
      title: 'Remote video',
      html: '<script>window.pwned = true</script><iframe src="https://evil.example"></iframe>',
      width: 16,
      height: 9,
    });

    const { container } = render(<Card card={card} onOpenMedia={onOpenMedia} />);

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();

    fireEvent.click(container.querySelector('button')!);
    expect(window.open).toHaveBeenCalledWith(
      'https://video.example/watch/1',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('fails closed for dangerous provider destinations', () => {
    const card = normalizeCard({
      type: 'video',
      url: 'javascript:alert(1)',
      title: 'Unsafe video',
      html: '<p>not rendered</p>',
      width: 16,
      height: 9,
    });

    const { container } = render(<Card card={card} onOpenMedia={onOpenMedia} />);
    fireEvent.click(container.querySelector('button')!);

    expect(window.open).not.toHaveBeenCalled();
    expect(screen.queryByText('not rendered')).toBeNull();
  });
});
