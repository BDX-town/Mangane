import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

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
          <a className='button' href='/auth/sign_up'>
            <FormattedMessage id='account.register' defaultMessage='Sign up' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(connect(mapStateToProps)(SignUpPanel));
