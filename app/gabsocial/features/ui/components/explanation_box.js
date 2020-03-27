import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

export default
class ExplanationBox extends React.PureComponent {

  render() {
    const { title, explanation, dismissable } = this.props;

    return (
      <div className='explanation-box'>
        {title && <div className='explanation-box__title'>{title}</div>}
        <div className='explanation-box__explanation'>
          {explanation}
          {dismissable && <span className='explanation-box__dismiss'>Dismiss</span>}
        </div>
      </div>
    )
  }
}
