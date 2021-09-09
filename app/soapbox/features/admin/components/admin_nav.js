import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  approvalCount: state.getIn(['admin', 'awaitingApproval']).count(),
  reportsCount: state.getIn(['admin', 'openReports']).count(),
});

export default @connect(mapStateToProps)
class AdminNav extends React.PureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map.isRequired,
    approvalCount: PropTypes.number,
    reportsCount: PropTypes.number,
  };

  render() {
    const { instance, approvalCount, reportsCount } = this.props;

    return (
      <>
        <div className='wtf-panel promo-panel'>
          <div className='promo-panel__container'>
            <NavLink className='promo-panel-item' to='/admin'>
              <Icon id='tachometer' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.dashboard' defaultMessage='Dashboard' />
            </NavLink>
            <NavLink className='promo-panel-item' to='/admin/reports'>
              <IconWithCounter icon='gavel' count={reportsCount} fixedWidth />
              <FormattedMessage id='admin_nav.reports' defaultMessage='Reports' />
            </NavLink>
            {((instance.get('registrations') && instance.get('approval_required')) || approvalCount > 0) && (
              <NavLink className='promo-panel-item' to='/admin/approval'>
                <IconWithCounter icon='user' count={approvalCount} fixedWidth />
                <FormattedMessage id='admin_nav.awaiting_approval' defaultMessage='Awaiting Approval' />
              </NavLink>
            )}
            {/* !instance.get('registrations') && (
              <NavLink className='promo-panel-item' to='#'>
                <Icon id='envelope' className='promo-panel-item__icon' fixedWidth />
                <FormattedMessage id='admin_nav.invites' defaultMessage='Invites' />
              </NavLink>
            ) */}
            {/* <NavLink className='promo-panel-item' to='#'>
              <Icon id='group' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.registration' defaultMessage='Registration' />
            </NavLink> */}
          </div>
        </div>
        {/* <div className='wtf-panel promo-panel'>
          <div className='promo-panel__container'>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='info-circle' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.site_profile' defaultMessage='Site Profile' />
            </NavLink>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='paint-brush' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.branding' defaultMessage='Branding' />
            </NavLink>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='bars' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.menus' defaultMessage='Menus' />
            </NavLink>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='file-o' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.pages' defaultMessage='Pages' />
            </NavLink>
          </div>
        </div>
        <div className='wtf-panel promo-panel'>
          <div className='promo-panel__container'>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='fediverse' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.mrf' defaultMessage='Federation' />
            </NavLink>
            <NavLink className='promo-panel-item' to='#'>
              <Icon id='filter' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.filtering' defaultMessage='Filtering' />
            </NavLink>
            <a className='promo-panel-item' href='/pleroma/admin/#/settings/index' target='_blank'>
              <Icon id='code' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='admin_nav.advanced' defaultMessage='Advanced' />
            </a>
          </div>
        </div> */}
      </>
    );
  }

}
