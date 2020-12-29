import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
class AdminNav extends React.PureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { instance } = this.props;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          <NavLink className='promo-panel-item' to='/admin'>
            <Icon id='tachometer' className='promo-panel-item__icon' fixedWidth />
            <FormattedMessage id='admin_nav.dashboard' defaultMessage='Dashboard' />
          </NavLink>
          {/* TODO: Make this actually useful */}
          {instance.get('approval_required') && (
            <a className='promo-panel-item' href='/pleroma/admin/#/users/index' target='_blank'>
              <Icon id='user' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.awaiting_approval' defaultMessage='Awaiting Approval' />
            </a>
          )}
          <a className='promo-panel-item' href='/pleroma/admin/#/reports/index' target='_blank'>
            <Icon id='gavel' className='promo-panel-item__icon' fixedWidth />
            <FormattedMessage id='admin_nav.reports' defaultMessage='Reports' />
          </a>
        </div>
      </div>
    );
  }

}
