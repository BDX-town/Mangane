import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { getBaseURL, isAdmin } from 'soapbox/utils/accounts';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';

import { openModal } from '../../../actions/modals';

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const instance = state.get('instance');

  return {
    account,
    features: getFeatures(instance),
    baseURL: getBaseURL(account),
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({
  onOpenHotkeys(e) {
    dispatch(openModal('HOTKEYS'));
    e.preventDefault();
  },
  onClickLogOut(e) {
    dispatch(logOut(intl));
    e.preventDefault();
  },
});

const LinkFooter = ({ onOpenHotkeys, account, features, onClickLogOut, baseURL }) => (
  <div className='getting-started__footer'>
    <ul>
      {account && <>
        {features.profileDirectory && <li><Link to='/directory'><FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' /></Link></li>}
        <li><Link to='/blocks'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></Link></li>
        <li><Link to='/mutes'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></Link></li>
        <li><Link to='/filters'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></Link></li>
        {features.federating && <li><Link to='/domain_blocks'><FormattedMessage id='navigation_bar.domain_blocks' defaultMessage='Domain blocks' /></Link></li>}
        <li><Link to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></Link></li>
        {isAdmin(account) && <li><a href='/pleroma/admin'><FormattedMessage id='navigation_bar.admin_settings' defaultMessage='AdminFE' /></a></li>}
        {isAdmin(account) && <li><Link to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Mangane config' /></Link></li>}
        <li><Link to='/settings/export'><FormattedMessage id='navigation_bar.export_data' defaultMessage='Export data' /></Link></li>
        <li>{features.importAPI ? (
          <Link to='/settings/import'><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></Link>
        ) : (
          <a href={`${baseURL}/settings/import`}><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></a>
        )}</li>
        {(features.federating && features.accountMoving) && <li><Link to='/settings/migration'><FormattedMessage id='navigation_bar.account_migration' defaultMessage='Move account' /></Link></li>}
        <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a></li>
      </>}
      <li><Link to='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></Link></li>
      {account && <li><Link to='/auth/sign_out' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></Link></li>}
    </ul>

    <p>
      <FormattedMessage
        id='getting_started.open_source_notice'
        defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} ({code_version}).'
        values={{
          code_name: sourceCode.displayName,
          code_link: <a href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a>,
          code_version: sourceCode.version,
        }}
      />
    </p>
  </div>
);

LinkFooter.propTypes = {
  account: ImmutablePropTypes.map,
  features: PropTypes.object.isRequired,
  onOpenHotkeys: PropTypes.func.isRequired,
  onClickLogOut: PropTypes.func.isRequired,
  baseURL: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
