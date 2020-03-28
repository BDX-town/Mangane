import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import VerificationBadge from './verification_badge';
import { acctFull } from '../utils/accounts';

export default class DisplayName extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    others: ImmutablePropTypes.list,
    localDomain: PropTypes.string,
  };

  render () {
    const { others, localDomain } = this.props;

    let displayName, suffix, account;

    if (others && others.size > 1) {
      displayName = others.take(2).map(a => [
        <bdi key={a.get('id')}>
          <strong className='display-name__html' dangerouslySetInnerHTML={{ __html: a.get('display_name_html') }} />
        </bdi>,
        a.get('is_verified') && <VerificationBadge />
      ]).reduce((prev, cur) => [prev, ', ', cur]);

      if (others.size - 2 > 0) {
        suffix = `+${others.size - 2}`;
      }
    } else {
      if (others && others.size > 0) {
        account = others.first();
      } else {
        account = this.props.account;
      }

      displayName = (
        <>
          <bdi><strong className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} /></bdi>
          {account.get('is_verified') && <VerificationBadge />}
        </>
      );
      suffix = <span className='display-name__account'>@{acctFull(account)}</span>;
    }

    return (
      <span className='display-name'>
        {displayName}
        {suffix}
      </span>
    );
  }

}
