import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import spring from 'react-motion/lib/spring';

import Avatar from '../../../components/avatar';
import Button from '../../../components/button';
import DisplayName from '../../../components/display_name';
import Icon from '../../../components/icon';
import RelativeTimestamp from '../../../components/relative_timestamp';
import StatusContent from '../../../components/status_content';
import Motion from '../util/optional_motion';

export default @injectIntl
class ActionsModal extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    actions: PropTypes.array,
    onClick: PropTypes.func,
    onClose: PropTypes.func.isRequired,
  };

  renderAction = (action, i) => {
    if (action === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { icon = null, text, meta = null, active = false, href = '#', isLogout, destructive } = action;

    return (
      <li key={`${text}-${i}`}>
        <a
          href={href}
          rel='noopener'
          onClick={this.props.onClick}
          data-index={i}
          className={classNames({ active, destructive })}
          data-method={isLogout ? 'delete' : null}
        >
          {icon && <Icon title={text} src={icon} role='presentation' tabIndex='-1' inverted />}
          <div>
            <div className={classNames({ 'actions-modal__item-label': !!meta })}>{text}</div>
            <div>{meta}</div>
          </div>
        </a>
      </li>
    );
  }

  render() {
    const { actions, onClose } = this.props;

    const status = this.props.status && (
      <div className='status light'>
        <div className='boost-modal__status-header'>
          <div className='boost-modal__status-time'>
            <a href={this.props.status.get('url')} className='status__relative-time' target='_blank' rel='noopener'>
              <RelativeTimestamp timestamp={this.props.status.get('created_at')} />
            </a>
          </div>

          <a href={`/@${this.props.status.getIn(['account', 'acct'])}`} className='status__display-name'>
            <div className='status__avatar'>
              <Avatar account={this.props.status.get('account')} size={48} />
            </div>

            <DisplayName account={this.props.status.get('account')} />
          </a>
        </div>

        <StatusContent status={this.props.status} />
      </div>
    );

    return (
      <Motion defaultStyle={{ top: 100 }} style={{ top: spring(0) }}>
        {({ top }) => (
          <div className='modal-root__modal actions-modal' style={{ top: `${top}%` }}>
            {status}

            <ul className={classNames({ 'with-status': !!status })}>
              {actions && actions.map(this.renderAction)}
              <Button className='actions-modal__close-button' onClick={onClose}>
                <FormattedMessage id='lightbox.close' defaultMessage='Close' />
              </Button>
            </ul>
          </div>
        )}
      </Motion>
    );
  }

}
