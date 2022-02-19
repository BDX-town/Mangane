import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import Icon from 'soapbox/components/icon';

import AvatarOverlay from '../../../components/avatar_overlay';
import DisplayName from '../../../components/display_name';

export default class MovedNote extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    from: ImmutablePropTypes.map.isRequired,
    to: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { from, to } = this.props;
    const displayNameHtml = { __html: from.get('display_name_html') };

    return (
      <div className='account__moved-note'>
        <div className='account__moved-note__message'>
          <div className='account__moved-note__icon-wrapper'><Icon src={require('feather-icons/dist/icons/briefcase.svg')} className='account__moved-note__icon' fixedWidth /></div>
          <FormattedMessage id='account.moved_to' defaultMessage='{name} has moved to:' values={{ name: <bdi><strong dangerouslySetInnerHTML={displayNameHtml} /></bdi> }} />
        </div>

        <NavLink to={`/@${this.props.to.get('acct')}`} className='detailed-status__display-name'>
          <div className='detailed-status__display-avatar'><AvatarOverlay account={to} friend={from} /></div>
          <DisplayName account={to} />
        </NavLink>
      </div>
    );
  }

}
