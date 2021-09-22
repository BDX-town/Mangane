import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { length } from 'stringz';
import ProgressCircle from 'soapbox/components/progress_circle';

const messages = defineMessages({
  title: { id: 'compose.character_counter.title', defaultMessage: 'Used {chars} out of {maxChars} characters' },
});

/**
 * Renders a character counter
 * @param {string} props.text - text to use to measure
 * @param {number} props.max - max text allowed
 */
class CharacterCounter extends React.PureComponent {

  render() {
    const { intl, text, max } = this.props;

    const textLength = length(text);
    const progress = textLength / max;

    return (
      <ProgressCircle
        title={intl.formatMessage(messages.title, { chars: textLength, maxChars: max })}
        progress={progress}
        radius={10}
        stroke={4}
      />
    );
  }

}

CharacterCounter.propTypes = {
  intl: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
};

export default injectIntl(CharacterCounter);
