import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';
import { logOut } from 'soapbox/actions/auth';

// FIXME: Let this be configured
const sourceCode = {
  name: 'soapbox-fe',
  url: 'https://gitlab.com/soapbox-pub/soapbox-fe',
  repository: 'soapbox-pub/soapbox-fe',
  version: '0.9-beta',
};

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
  };
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

const LinkFooter = ({ onOpenHotkeys, account, onClickLogOut }) => (
  <div className='getting-started__footer'>
    <ul>
      {account && <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a> · </li>}
      {/* {account && <li><a href='/auth/edit'><FormattedMessage id='getting_started.security' defaultMessage='Security' /></a> · </li>} */}
      <li><a href='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></a> · </li>
      {/* <li><a href='/settings/applications'><FormattedMessage id='getting_started.developers' defaultMessage='Developers' /></a> · </li> */}
      {account && <li><Link to='/auth/sign_out' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></Link></li>}
    </ul>

    <p>
      <FormattedMessage
        id='getting_started.open_source_notice'
        defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
        values={{
          code_name: sourceCode.name,
          code_link: <a href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a>,
          code_version: sourceCode.version,
        }}
      />
    </p>
  </div>
);

LinkFooter.propTypes = {
  account: ImmutablePropTypes.map,
  onOpenHotkeys: PropTypes.func.isRequired,
  onClickLogOut: PropTypes.func.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
