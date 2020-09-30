import React from 'react';
import PropTypes from 'prop-types';

export default class TypingIndicator extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
  };

  render() {
    const { active } = this.props;

    if (!active) {
      return (
        <div className='typing-indicator' />
      );
    }
    return (
      <div className='typing-indicator'>
        <div className='typing-indicator__message'>
          <img src={'http://support.wirelessmessaging.com/temp/ep/activity.gif'} alt='Typing...' width='40' height='25' />
        </div>
      </div>
    );
  }

}
