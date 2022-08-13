import React from 'react';

import { fireEvent, render, screen } from '../../../../jest/test-helpers';
import Button from '../button';

describe('<Button />', () => {
  it('renders the given text', () => {
    const text = 'foo';
    render(<Button text={text} />);

    expect(screen.getByRole('button')).toHaveTextContent(text);
  });

  it('renders the children', () => {
    render(<Button><p>children</p></Button>);

    expect(screen.getByRole('button')).toHaveTextContent('children');
  });

  it('renders the props.text instead of children', () => {
    const text = 'foo';
    const children = <p>children</p>;
    render(<Button text={text}>{children}</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('foo');
    expect(screen.getByRole('button')).not.toHaveTextContent('children');
  });

  it('handles click events using the given handler', () => {
    const handler = jest.fn();
    render(<Button onClick={handler} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handler.mock.calls.length).toEqual(1);
  });

  it('does not handle click events if props.disabled given', () => {
    const handler = jest.fn();
    render(<Button onClick={handler} disabled />);

    fireEvent.click(screen.getByRole('button'));
    expect(handler.mock.calls.length).toEqual(0);
  });

  it('renders a disabled attribute if props.disabled given', () => {
    render(<Button disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('render full-width button if block prop given', () => {
    render(<Button block />);

    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('handles Theme properly', () => {
    render(<Button theme='tertiary' />);

    expect(screen.getByRole('button')).toHaveClass('bg-transparent border-gray-400');
  });

  describe('to prop', () => {
    it('renders a link', () => {
      render(<Button to='/'>link</Button>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('does not render a link', () => {
      render(<Button>link</Button>);

      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
  });

  describe('icon prop', () => {
    it('renders an icon', () => {
      render(<Button icon='icon.png'>button</Button>);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('does not render an icon', () => {
      render(<Button>button</Button>);

      expect(screen.queryAllByTestId('icon')).toHaveLength(0);
    });
  });
});
