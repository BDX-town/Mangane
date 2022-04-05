import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { displayFqn } from 'soapbox/utils/state';

import { getAcct } from '../utils/accounts';

import Icon from './icon';
import RelativeTimestamp from './relative_timestamp';
import VerificationBadge from './verification_badge';

const mapStateToProps = state => {
  return {
    displayFqn: displayFqn(state),
  };
};

export default @connect(mapStateToProps)
class DisplayName extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record.isRequired,
    displayFqn: PropTypes.bool,
    others: ImmutablePropTypes.list,
    children: PropTypes.node,
    withDate: PropTypes.bool,
  };

  static defaultProps = {
    withDate: false,
  }

  render() {
    const { account, displayFqn, others, children, withDate } = this.props;

    let displayName, suffix;
    const verified = account.get('verified');

    const createdAt = account.get('created_at');

    const joinedAt = createdAt ? (
      <div className='account__joined-at'>
        <Icon src={require('@tabler/icons/icons/clock.svg')} />
        <RelativeTimestamp timestamp={createdAt} />
      </div>
    ) : null;

    if (others?.size > 1) {
      displayName = others.take(2).map(a => (
        <span className='display-name__name' key={a.get('id')}>
          <bdi><strong className='display-name__html' dangerouslySetInnerHTML={{ __html: a.get('display_name_html') }} /></bdi>
          {verified && <VerificationBadge />}
          {withDate && joinedAt}
        </span>
      )).reduce((prev, cur) => [prev, ', ', cur]);

      if (others.size - 2 > 0) {
        suffix = `+${others.size - 2}`;
      }
    } else {
      displayName = (
        <span className='display-name__name'>
          <bdi><strong className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} /></bdi>
          {verified && <VerificationBadge />}
          {withDate && joinedAt}
        </span>
      );
      suffix = <span className='display-name__account'>@{getAcct(account, displayFqn)}</span>;
    }

    return (
      <span className='display-name' data-testid='display-name'>
        <HoverRefWrapper accountId={account.get('id')} inline>
          {displayName}
        </HoverRefWrapper>
        {suffix}
        {children}
      </span>
    );
  }

}
