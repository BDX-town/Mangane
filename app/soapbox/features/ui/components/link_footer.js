import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';
import { logOut } from 'soapbox/actions/auth';
import { isAdmin } from 'soapbox/utils/accounts';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';

const mapStateToProps = state => {
  const me = state.get('me');
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    account: state.getIn(['accounts', me]),
    federating: features.federating,
    showAliases: features.accountAliasesAPI,
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'));
  },
  onClickLogOut(e) {
    dispatch(logOut(intl));
    e.preventDefault();
  },
});

const LinkFooter = ({ onOpenHotkeys, account, federating, showAliases, onClickLogOut }) => (
  <div className='getting-started__footer'>
    <ul>
      {account && <>
        <li><Link to='/blocks'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></Link></li>
        <li><Link to='/mutes'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></Link></li>
        <li><Link to='/filters'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></Link></li>
        {federating && <li><Link to='/domain_blocks'><FormattedMessage id='navigation_bar.domain_blocks' defaultMessage='Domain blocks' /></Link></li>}
        <li><Link to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></Link></li>
        {isAdmin(account) && <li><a href='/pleroma/admin'><FormattedMessage id='navigation_bar.admin_settings' defaultMessage='AdminFE' /></a></li>}
        {isAdmin(account) && <li><Link to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Soapbox config' /></Link></li>}
        <li><Link to='/settings/export'><FormattedMessage id='navigation_bar.export_data' defaultMessage='Export data' /></Link></li>
        <li><Link to='/settings/import'><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></Link></li>
        {(federating && showAliases) && <li><Link to='/settings/aliases'><FormattedMessage id='navigation_bar.account_aliases' defaultMessage='Account aliases' /></Link></li>}
        <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a></li>
      </>}
      <li><Link to='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></Link></li>
      {account && <li><Link to='/auth/sign_out' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></Link></li>}
    </ul>

    <p>
      <FormattedMessage
        id='getting_started.open_source_notice'
        defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
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
  federating: PropTypes.bool,
  showAliases: PropTypes.bool,
  onOpenHotkeys: PropTypes.func.isRequired,
  onClickLogOut: PropTypes.func.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
