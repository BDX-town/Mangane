import userEvent from '@testing-library/user-event';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import Modal from '../modal';

describe('<Modal />', () => {
  it('renders', () => {
    render(<Modal title='Modal title' />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Modal title='Modal title'><div data-testid='child' /></Modal>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('focuses the primary action', () => {
    render(
      <Modal
        title='Modal title'
        confirmationAction={() => null}
        confirmationText='Click me'
      />,
    );

    expect(screen.getByRole('button')).toHaveFocus();
  });

  describe('onClose prop', () => {
    it('renders the Icon to close the modal', async() => {
      const mockFn = jest.fn();
      const user = userEvent.setup();

      render(<Modal title='Modal title' onClose={mockFn} />);
      expect(screen.getByTestId('icon-button')).toBeInTheDocument();

      expect(mockFn).not.toBeCalled();
      await user.click(screen.getByTestId('icon-button'));
      expect(mockFn).toBeCalled();
    });

    it('does not render the Icon to close the modal', () => {
      render(<Modal title='Modal title' />);
      expect(screen.queryAllByTestId('icon-button')).toHaveLength(0);
    });
  });

  describe('confirmationAction prop', () => {
    it('renders the confirmation button', async() => {
      const mockFn = jest.fn();
      const user = userEvent.setup();

      render(
        <Modal
          title='Modal title'
          confirmationAction={mockFn}
          confirmationText='Click me'
        />,
      );

      expect(mockFn).not.toBeCalled();
      await user.click(screen.getByRole('button'));
      expect(mockFn).toBeCalled();
    });

    it('does not render the actions to', () => {
      render(<Modal title='Modal title' />);
      expect(screen.queryAllByTestId('modal-actions')).toHaveLength(0);
    });

    describe('with secondaryAction', () => {
      it('renders the secondary button', async() => {
        const confirmationAction = jest.fn();
        const secondaryAction = jest.fn();
        const user = userEvent.setup();

        render(
          <Modal
            title='Modal title'
            confirmationAction={confirmationAction}
            confirmationText='Primary'
            secondaryAction={secondaryAction}
            secondaryText='Secondary'
          />,
        );

        await user.click(screen.getByText(/secondary/i));
        expect(secondaryAction).toBeCalled();
        expect(confirmationAction).not.toBeCalled();
      });

      it('does not render the secondary action', () => {
        render(
          <Modal
            title='Modal title'
            confirmationAction={() => null}
            confirmationText='Click me'
          />,
        );
        expect(screen.queryAllByRole('button')).toHaveLength(1);
      });
    });

    describe('with cancelAction', () => {
      it('renders the cancel button', async() => {
        const confirmationAction = jest.fn();
        const cancelAction = jest.fn();
        const user = userEvent.setup();

        render(
          <Modal
            title='Modal title'
            confirmationAction={confirmationAction}
            confirmationText='Primary'
            secondaryAction={cancelAction}
            secondaryText='Cancel'
          />,
        );

        await user.click(screen.getByText(/cancel/i));
        expect(cancelAction).toBeCalled();
        expect(confirmationAction).not.toBeCalled();
      });

      it('does not render the cancel action', () => {
        render(
          <Modal
            title='Modal title'
            confirmationAction={() => null}
            confirmationText='Click me'
          />,
        );
        expect(screen.queryAllByRole('button')).toHaveLength(1);
      });
    });
  });
});
