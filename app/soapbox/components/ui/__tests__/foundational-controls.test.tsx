import React from 'react';

import { fireEvent, render, screen } from '../../../jest/test-helpers';
import {
  Avatar,
  Button,
  Card,
  Chip,
  FormGroup,
  IconButton,
  Input,
  ListRow,
  Menu,
  MenuItem,
  MenuList,
  MenuTrigger,
  SegmentedControl,
  useFocusReturn,
} from '../index';

describe('foundational control contracts', () => {
  it('keeps button, link, busy, and pressed semantics native', () => {
    const onClick = jest.fn();
    const linkClick = jest.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.currentTarget.tagName);
    const linkRef = React.createRef<HTMLAnchorElement>();
    const { unmount } = render(
      <Button loading onClick={onClick}>Save</Button>,
    );

    const busyButton = screen.getByRole('button', { name: 'Save' });
    expect(busyButton).toBeDisabled();
    expect(busyButton).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(busyButton);
    expect(onClick).not.toHaveBeenCalled();

    unmount();
    const pressedView = render(<Button pressed onClick={onClick}>Pin</Button>);
    expect(screen.getByRole('button', { name: 'Pin' })).toHaveAttribute('aria-pressed', 'true');

    pressedView.unmount();
    render(<Button ref={linkRef} to='/settings' onClick={linkClick}>Settings</Button>);
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(linkClick).toHaveReturnedWith('A');
    expect(linkRef.current).toBe(screen.getByRole('link', { name: 'Settings' }));
  });

  it('requires an accessible icon-button name and preserves toggle state', () => {
    render(<IconButton icon='question' label='More options' pressed />);

    const trigger = screen.getByRole('button', { name: 'More options' });
    expect(trigger).toHaveAttribute('aria-pressed', 'true');
    expect(trigger).toHaveClass('ds-icon-button');
  });

  it('renders list rows and chips with explicit selected state', () => {
    const onRowClick = jest.fn();
    const onChipClick = jest.fn();
    render(
      <>
        <ListRow selected onClick={onRowClick}>Local timeline</ListRow>
        <Chip selected onClick={onChipClick}>Following</Chip>
      </>,
    );

    const row = screen.getByRole('button', { name: 'Local timeline' });
    expect(row).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(row);
    expect(onRowClick).toHaveBeenCalledTimes(1);

    const chip = screen.getByRole('button', { name: 'Following' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(onChipClick).toHaveBeenCalledTimes(1);
  });

  it('preserves link-row callbacks and blocks them only when disabled', () => {
    const onClick = jest.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.currentTarget.tagName);
    const linkRef = React.createRef<HTMLAnchorElement>();
    const view = render(
      <ListRow ref={linkRef} to='/local' onClick={onClick}>Local</ListRow>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Local' }));
    expect(onClick).toHaveReturnedWith('A');
    expect(linkRef.current).toBe(screen.getByRole('link', { name: 'Local' }));

    view.unmount();
    render(<ListRow disabled to='/local' onClick={onClick}>Unavailable</ListRow>);
    fireEvent.click(screen.getByRole('link', { name: 'Unavailable' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('provides roving keyboard selection for segmented controls', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        ariaLabel='Timeline density'
        value='comfortable'
        onChange={onChange}
        options={[
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Roomy', value: 'roomy', disabled: true },
        ]}
      />,
    );

    const comfortable = screen.getByRole('radio', { name: 'Comfortable' });
    comfortable.focus();
    fireEvent.keyDown(comfortable, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith('compact');
    expect(screen.getByRole('radio', { name: 'Compact' })).toHaveFocus();

    fireEvent.keyDown(comfortable, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('compact');
  });

  it('keeps an enabled segmented option tabbable when the value is stale', () => {
    render(
      <SegmentedControl
        ariaLabel='Reading mode'
        value='removed-mode'
        onChange={jest.fn()}
        options={[
          { label: 'Unavailable', value: 'unavailable', disabled: true },
          { label: 'Standard', value: 'standard' },
        ]}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Unavailable' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveAttribute('tabindex', '0');
  });

  it('restores focus after a transient surface closes', () => {
    const FocusHarness = () => {
      const [active, setActive] = React.useState(false);
      useFocusReturn(active);

      return (
        <>
          <button type='button' onClick={() => setActive(true)}>Open composer</button>
          {active ? <button type='button' onClick={() => setActive(false)}>Close composer</button> : null}
        </>
      );
    };

    render(<FocusHarness />);
    const opener = screen.getByRole('button', { name: 'Open composer' });
    opener.focus();
    fireEvent.click(opener);
    const closer = screen.getByRole('button', { name: 'Close composer' });
    closer.focus();
    fireEvent.click(closer);

    expect(opener).toHaveFocus();
  });

  it('associates field hints and errors without exposing unsafe markup', () => {
    render(
      <>
        <FormGroup labelText='Handle' hintText='Letters and numbers only' errors={['Already taken']}>
          <Input aria-describedby='external-rule' value='alice' onChange={jest.fn()} />
        </FormGroup>
        <p id='external-rule'>Public profiles only</p>
      </>,
    );

    const field = screen.getByRole('textbox', { name: 'Handle' });
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Public profiles only Letters and numbers only Already taken');
    expect(screen.getByRole('alert')).toHaveTextContent('Already taken');
  });

  it('supports labelled card, avatar, and menu-trigger foundations', () => {
    render(
      <>
        <Card as='section' aria-label='Account summary'>Summary</Card>
        <Avatar src='/static/alice.jpg' alt='Alice' size={Number.POSITIVE_INFINITY} />
        <Menu>
          <MenuTrigger label='Account actions' icon='question' />
          <MenuList>
            <MenuItem onSelect={jest.fn()}>Mute</MenuItem>
          </MenuList>
        </Menu>
      </>,
    );

    expect(screen.getByRole('region', { name: 'Account summary' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alice' }).parentElement).toHaveStyle({ width: '42px', height: '42px' });
    expect(screen.getByRole('button', { name: 'Account actions' })).toHaveAttribute('aria-haspopup', 'true');
  });
});
