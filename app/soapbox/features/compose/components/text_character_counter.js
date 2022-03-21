import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { length } from 'stringz';

export default class TextCharacterCounter extends React.PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
  };

  checkRemainingText(diff) {
    return (
      <span
        className={classNames('text-sm font-semibold', {
          'text-gray-400': diff >= 0,
          'text-danger-600': diff < 0,
        })}
      >
        {diff}
      </span>
    );
  }

  render() {
    const diff = this.props.max - length(this.props.text);
    return this.checkRemainingText(diff);
  }

}
