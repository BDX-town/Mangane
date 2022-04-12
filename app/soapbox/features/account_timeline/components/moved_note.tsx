import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import AvatarOverlay from 'soapbox/components/avatar_overlay';
import DisplayName from 'soapbox/components/display_name';
import Icon from 'soapbox/components/icon';

import type { Account as AccountEntity } from 'soapbox/types/entities';

interface IMovedNote {
  from: AccountEntity,
  to: AccountEntity,
}

const MovedNote: React.FC<IMovedNote> = ({ from, to }) => {
  const displayNameHtml = { __html: from.display_name_html };

  return (
    <div className='account__moved-note'>
      <div className='account__moved-note__message'>
        <div className='account__moved-note__icon-wrapper'><Icon src={require('feather-icons/dist/icons/briefcase.svg')} className='account__moved-note__icon' fixedWidth /></div>
        <FormattedMessage id='account.moved_to' defaultMessage='{name} has moved to:' values={{ name: <bdi><strong dangerouslySetInnerHTML={displayNameHtml} /></bdi> }} />
      </div>

      <NavLink to={`/@${to.acct}`} className='detailed-status__display-name'>
        <div className='detailed-status__display-avatar'><AvatarOverlay account={to} friend={from} /></div>
        <DisplayName account={to} />
      </NavLink>
    </div>
  );
};

export default MovedNote;
