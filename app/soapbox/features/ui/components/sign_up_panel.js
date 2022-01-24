import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

const mapStateToProps = state => {
  return {
    siteTitle: state.getIn(['instance', 'title']),
    me: state.get('me'),
  };
};

const SignUpPanel = ({ siteTitle, me }) => {
  if (me) return null;

  return (
    <div className='wtf-panel'>
      <div className='wtf-panel-header'>
        <span className='wtf-panel-header__label'>
          <FormattedMessage id='signup_panel.title' defaultMessage='New to {site_title}?' values={{ site_title: siteTitle }} />
        </span>
      </div>
      <div className='wtf-panel__content'>
        <span className='wtf-panel__subtitle'>
          <FormattedMessage id='signup_panel.subtitle' defaultMessage='Sign up now to discuss.' />
        </span>
        <div className='wtf-panel__form'>
          <a className='button' href='/'>
            <FormattedMessage id='account.register' defaultMessage='Sign up' />
          </a>
        </div>
      </div>
    </div>
  );
};

SignUpPanel.propTypes = {
  siteTitle: PropTypes.string,
  me: SoapboxPropTypes.me,
};

export default injectIntl(connect(mapStateToProps)(SignUpPanel));
