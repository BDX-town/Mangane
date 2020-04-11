import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { invitesEnabled, version, repository, source_url } from 'gabsocial/initial_state';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';
import { logOut } from 'gabsocial/actions/auth';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
    siteTitle: state.getIn(['instance', 'title']),
  }
};

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'));
  },
  onClickLogOut(e) {
    dispatch(logOut());
    e.preventDefault();
  },
});

const LinkFooter = ({ onOpenHotkeys, account, siteTitle, onClickLogOut }) => (
  <div className='getting-started__footer'>
    <ul>
      {(invitesEnabled && account) && <li><a href='/invites'><FormattedMessage id='getting_started.invite' defaultMessage='Invite people' /></a> · </li>}
      {account && <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a> · </li>}
      {account && <li><a href='/auth/edit'><FormattedMessage id='getting_started.security' defaultMessage='Security' /></a> · </li>}
      <li><a href='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></a> · </li>
      <li><a href='/settings/applications'><FormattedMessage id='getting_started.developers' defaultMessage='Developers' /></a> · </li>
      <li><a href='/about/tos'><FormattedMessage id='getting_started.terms' defaultMessage='Terms of Service' /></a> · </li>
      <li><a href='/about/dmca'><FormattedMessage id='getting_started.dmca' defaultMessage='DMCA' /></a> · </li>
      <li><a href='/about/privacy'><FormattedMessage id='getting_started.privacy' defaultMessage='Privacy Policy' /></a></li>
      {account && <li> · <Link to='/auth/sign_out' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></Link></li>}
    </ul>

    <p>
      <FormattedMessage
        id='getting_started.open_source_notice'
        defaultMessage='{site_title} is open source software. You can contribute or report issues on GitLab at {gitlab}.'
        values={{site_title: siteTitle, gitlab: <span><a href={source_url} rel='noopener' target='_blank'>{repository}</a> (v{version})</span> }}
      />
    </p>
  </div>
);

LinkFooter.propTypes = {
  withHotkeys: PropTypes.bool,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
