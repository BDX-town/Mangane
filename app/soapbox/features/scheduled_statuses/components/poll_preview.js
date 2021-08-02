import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';

export default class PollPreview extends ImmutablePureComponent {

  static propTypes = {
    poll: ImmutablePropTypes.map,
  };

  renderOption(option) {
    const { poll } = this.props;
    const showResults        = poll.get('voted') || poll.get('expired');

    return (
      <li key={option}>
        <label className={classNames('poll__text', { selectable: !showResults })}>
          <input
            name='vote-options'
            type={poll.get('multiple') ? 'checkbox' : 'radio'}
            onChange={this.handleOptionChange}
            disabled
          />

          <span className={classNames('poll__input', { checkbox: poll.get('multiple') })} />

          <span dangerouslySetInnerHTML={{ __html: option }} />
        </label>
      </li>
    );
  }

  render() {
    const { poll } = this.props;

    if (!poll) {
      return null;
    }

    return (
      <div className='poll'>
        <ul>
          {poll.get('options').map((option, i) => this.renderOption(option, i))}
        </ul>
      </div>
    );
  }

}
