import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { usePopper } from 'react-popper';
import { useHistory } from 'react-router-dom';

import { fetchRelationships } from 'soapbox/actions/accounts';
import {
  closeStatusHoverCard,
  updateStatusHoverCard,
} from 'soapbox/actions/status-hover-card';
import ActionButton from 'soapbox/features/ui/components/action-button';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { UserPanel } from 'soapbox/features/ui/util/async-components';
import StatusContainer from 'soapbox/containers/status_container';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';
import { fetchStatus } from 'soapbox/actions/statuses';

import { showStatusHoverCard } from './hover-status-wrapper';
import { Card, CardBody, Stack, Text } from './ui';

import type { AppDispatch } from 'soapbox/store';

const getStatus = makeGetStatus();

const handleMouseEnter = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(updateStatusHoverCard());
  };
};

const handleMouseLeave = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(closeStatusHoverCard(true));
  };
};

interface IStatusHoverCard {
  visible: boolean,
}

/** Popup status preview that appears when hovering reply to */
export const StatusHoverCard: React.FC<IStatusHoverCard> = ({ visible = true }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const statusId: string | undefined = useAppSelector(state => state.status_hover_card.statusId || undefined);
  const targetRef = useAppSelector(state => state.status_hover_card.ref?.current);

  useEffect(() => {
    if (statusId) dispatch(fetchStatus(statusId));
  }, [dispatch, statusId])

  useEffect(() => {
    const unlisten = history.listen(() => {
      showStatusHoverCard.cancel();
      dispatch(closeStatusHoverCard());
    });

    return () => {
      unlisten();
    };
  }, []);

  const { styles, attributes } = usePopper(targetRef, popperElement, {
    placement: 'top'
  });

  if (!statusId) return null;

  const renderStatus = (statusId: string) => {
    return (
      // @ts-ignore
      <StatusContainer
        key={statusId}
        id={statusId}
        hideActionBar
      />
    );
  };

  return (
    <div
      className={classNames({
        'absolute transition-opacity w-[500px] z-50 top-0 left-0': true,
        'opacity-100': visible,
        'opacity-0 pointer-events-none': !visible,
      })}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      onMouseEnter={handleMouseEnter(dispatch)}
      onMouseLeave={handleMouseLeave(dispatch)}
    >
      <Card className='relative'>
        <CardBody>
          {renderStatus(statusId)}
        </CardBody>
      </Card>
    </div>
  );
};

export default StatusHoverCard;
