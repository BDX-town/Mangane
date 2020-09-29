import React from 'react';
import PropTypes from 'prop-types';

export default class TypingIndicator extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
  };

  render() {
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <div className='typing-indicator'>
        <div className='typing-indicator__message'>
          <img src={'../images/activity.gif'} alt='' width='45' height='25' />
        </div>
      </div>
    );
  }

}
