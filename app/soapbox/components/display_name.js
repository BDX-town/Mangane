import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import VerificationBadge from './verification_badge';
import { getAcct } from '../utils/accounts';
import { List as ImmutableList } from 'immutable';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { displayFqn } from 'soapbox/utils/state';

const mapStateToProps = state => {
  return {
    displayFqn: displayFqn(state),
  };
};

export default @connect(mapStateToProps)
class DisplayName extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    displayFqn: PropTypes.bool,
    others: ImmutablePropTypes.list,
    children: PropTypes.node,
  };

  render() {
    const { account, displayFqn, others, children } = this.props;

    let displayName, suffix;
    const verified = account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified');

    if (others && others.size > 1) {
      displayName = others.take(2).map(a => [
        <bdi key={a.get('id')}>
          <strong className='display-name__html' dangerouslySetInnerHTML={{ __html: a.get('display_name_html') }} />
        </bdi>,
        verified && <VerificationBadge />,
      ]).reduce((prev, cur) => [prev, ', ', cur]);

      if (others.size - 2 > 0) {
        suffix = `+${others.size - 2}`;
      }
    } else {
      displayName = (
        <>
          <bdi><strong className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} /></bdi>
          {verified && <VerificationBadge />}
        </>
      );
      suffix = <span className='display-name__account'>@{getAcct(account, displayFqn)}</span>;
    }

    return (
      <span className='display-name'>
        <HoverRefWrapper accountId={account.get('id')} inline>
          {displayName}
        </HoverRefWrapper>
        {suffix}
        {children}
      </span>
    );
  }

}
