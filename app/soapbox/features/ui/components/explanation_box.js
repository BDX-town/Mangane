import React from 'react';
import PropTypes from 'prop-types';

export default
class ExplanationBox extends React.PureComponent {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    explanation: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    dismissable: PropTypes.bool,
  };

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
    );
  }

}
