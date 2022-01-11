import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { changeSettingImmediate } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import { SimpleForm, TextInput } from 'soapbox/features/forms';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  answerLabel: { id: 'developers.challenge.answer_label', defaultMessage: 'Answer' },
  answerPlaceholder: { id: 'developers.challenge.answer_placeholder', defaultMessage: 'Your answer' },
  success: { id: 'developers.challenge.success', defaultMessage: 'You are now a developer' },
  fail: { id: 'developers.challenge.fail', defaultMessage: 'Wrong answer' },
});

export default @connect()
@injectIntl
class DevelopersChallenge extends React.Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    answer: '',
  }

  handleChangeAnswer = e => {
    this.setState({ answer: e.target.value });
  }

  handleSubmit = e => {
    const { intl, dispatch } = this.props;
    const { answer } = this.state;

    if (answer === 'boxsoap') {
      dispatch(changeSettingImmediate(['isDeveloper'], true));
      dispatch(snackbar.success(intl.formatMessage(messages.success)));
    } else {
      dispatch(snackbar.error(intl.formatMessage(messages.fail)));
    }
  }

  render() {
    const { intl } = this.props;

    const challenge = `function soapbox() {
  return 'soap|box'.split('|').reverse().join('');
}`;

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <div className='developers-challenge'>
          <SimpleForm onSubmit={this.handleSubmit}>
            <FormattedMessage
              id='developers.challenge.message'
              defaultMessage='What is the result of calling {function}?'
              values={{ function: <span className='code'>soapbox()</span> }}
            />
            <pre className='code'>
              {challenge}
            </pre>
            <TextInput
              name='answer'
              label={intl.formatMessage(messages.answerLabel)}
              placeholder={intl.formatMessage(messages.answerPlaceholder)}
              onChange={this.handleChangeAnswer}
              value={this.state.answer}
            />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                <FormattedMessage id='developers.challenge.submit' defaultMessage='Become a developer' />
              </button>
            </div>
          </SimpleForm>
        </div>
      </Column>
    );
  }

}
