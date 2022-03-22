import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Text } from 'soapbox/components/ui';
import emojify from 'soapbox/features/emoji/emoji';
import { getBaseURL } from 'soapbox/utils/accounts';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';

import { openModal } from '../../../actions/modals';

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const instance = state.get('instance');
  const features = getFeatures(instance);
  const soapboxConfig = getSoapboxConfig(state);

  return {
    account,
    soapboxConfig,
    profileDirectory: features.profileDirectory,
    federating: features.federating,
    showAliases: features.accountAliasesAPI,
    importAPI: features.importAPI,
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

const LinkFooter = ({ onOpenHotkeys, account, profileDirectory, federating, showAliases, importAPI, onClickLogOut, baseURL, soapboxConfig }) => (
  <div className='space-y-2'>
    <ul className='flex flex-wrap items-center divide-x-dot'>
      {account && <>
        {profileDirectory && <li><Link to='/directory' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' /></Link></li>}
        <li><Link to='/blocks' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></Link></li>
        <li><Link to='/mutes' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></Link></li>
        {/* <li><Link to='/filters' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></Link></li> */}
        {federating && <li><Link to='/domain_blocks' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.domain_blocks' defaultMessage='Domain blocks' /></Link></li>}
        {/* <li><Link to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></Link></li> */}
        {/* isAdmin(account) && <li><a href='/pleroma/admin' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.admin_settings' defaultMessage='AdminFE' /></a></li> */}
        {/* isAdmin(account) && <li><Link to='/soapbox/config' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Soapbox config' /></Link></li> */}
        {/* <li><Link to='/settings/export'><FormattedMessage id='navigation_bar.export_data' defaultMessage='Export data' /></Link></li> */}
        {/* <li>{importAPI ? (
          <Link to='/settings/import'><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></Link>
        ) : (
          <a href={`${baseURL}/settings/import`}><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></a>
        )}</li> */}
        {(federating && showAliases) && <li><Link to='/settings/aliases' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.account_aliases' defaultMessage='Account aliases' /></Link></li>}
        {/* <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a></li> */}
      </>}
      <li><a target='_blank' href='https://help.truthsocial.com/legal' className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.legal' defaultMessage='Legal' /></a></li>
      {/* <li><Link to='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></Link></li> */}
      {account && <li><Link to='/auth/sign_out' onClick={onClickLogOut} className='text-gray-400 hover:text-gray-500 hover:underline'><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></Link></li>}
    </ul>

    <Text theme='muted' size='sm'>
      {soapboxConfig.get('linkFooterMessage') ? (
        <span
          className='inline-block align-middle'
          dangerouslySetInnerHTML={{ __html: emojify(soapboxConfig.get('linkFooterMessage')) }}
        />
      ) : (
        <FormattedMessage
          id='getting_started.open_source_notice'
          defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
          values={{
            code_name: sourceCode.displayName,
            code_link: <a href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a>,
            code_version: sourceCode.version,
          }}
        />
      )}
    </Text>
  </div>
);

LinkFooter.propTypes = {
  account: ImmutablePropTypes.map,
  soapboxConfig: ImmutablePropTypes.map,
  profileDirectory: PropTypes.bool,
  federating: PropTypes.bool,
  showAliases: PropTypes.bool,
  importAPI: PropTypes.bool,
  onOpenHotkeys: PropTypes.func.isRequired,
  onClickLogOut: PropTypes.func.isRequired,
  baseURL: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
