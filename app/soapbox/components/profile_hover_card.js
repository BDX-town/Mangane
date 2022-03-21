import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { useIntl } from 'react-intl';
import { usePopper } from 'react-popper';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchRelationships } from 'soapbox/actions/accounts';
import {
  closeProfileHoverCard,
  updateProfileHoverCard,
} from 'soapbox/actions/profile_hover_card';
import Badge from 'soapbox/components/badge';
import ActionButton from 'soapbox/features/ui/components/action_button';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { UserPanel } from 'soapbox/features/ui/util/async-components';
import { makeGetAccount } from 'soapbox/selectors';
import { isAdmin, isModerator } from 'soapbox/utils/accounts';

import { showProfileHoverCard } from './hover_ref_wrapper';
import { Card, CardBody, Stack, Text } from './ui';

const getAccount = makeGetAccount();

const getBadges = (account) => {
  const badges = [];

  if (isAdmin(account)) {
    badges.push(<Badge key='admin' slug='admin' title='Admin' />);
  } else if (isModerator(account)) {
    badges.push(<Badge key='moderator' slug='moderator' title='Moderator' />);
  }

  if (account.getIn(['patron', 'is_patron'])) {
    badges.push(<Badge key='patron' slug='patron' title='Patron' />);
  }

  return badges;
};

const handleMouseEnter = (dispatch) => {
  return e => {
    dispatch(updateProfileHoverCard());
  };
};

const handleMouseLeave = (dispatch) => {
  return e => {
    dispatch(closeProfileHoverCard(true));
  };
};

export const ProfileHoverCard = ({ history, visible }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [popperElement, setPopperElement] = useState(null);

  const me = useSelector(state => state.get('me'));
  const accountId = useSelector(state => state.getIn(['profile_hover_card', 'accountId']));
  const account   = useSelector(state => accountId && getAccount(state, accountId));
  const targetRef = useSelector(state => state.getIn(['profile_hover_card', 'ref', 'current']));
  const badges = account ? getBadges(account) : [];

  useEffect(() => {
    if (accountId) dispatch(fetchRelationships([accountId]));
  }, [dispatch, accountId]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      showProfileHoverCard.cancel();
      dispatch(closeProfileHoverCard());
    });

    return () => {
      unlisten();
    };
  }, []);

  const { styles, attributes } = usePopper(targetRef, popperElement);

  if (!account) return null;
  const accountBio = { __html: account.get('note_emojified') };
  const followedBy = me !== account.get('id') && account.getIn(['relationship', 'followed_by']);

  return (
    <div
      className={classNames({
        'absolute transition-opacity w-[320px] z-50 top-0 left-0': true,
        'opacity-100': visible,
        'opacity-0 pointer-events-none': !visible,
      })}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      onMouseEnter={handleMouseEnter(dispatch)}
      onMouseLeave={handleMouseLeave(dispatch)}
    >
      <Card variant='rounded' className='relative'>
        <CardBody>
          <Stack space={2}>
            <BundleContainer fetchComponent={UserPanel}>
              {Component => (
                <Component
                  accountId={account.get('id')}
                  action={<ActionButton account={account} small />}
                  badges={badges}
                />
              )}
            </BundleContainer>

            {account.getIn(['source', 'note'], '').length > 0 && (
              <Text size='sm' dangerouslySetInnerHTML={accountBio} />
            )}
          </Stack>

          {followedBy && (
            <div className='absolute top-2 left-2'>
              <Badge
                slug='opaque'
                title={intl.formatMessage({ id: 'account.follows_you', defaultMessage: 'Follows you' })}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

ProfileHoverCard.propTypes = {
  visible: PropTypes.bool,
  accountId: PropTypes.string,
  account: ImmutablePropTypes.map,
  history: PropTypes.object.isRequired,
};

ProfileHoverCard.defaultProps = {
  visible: true,
};

export default withRouter(ProfileHoverCard);
