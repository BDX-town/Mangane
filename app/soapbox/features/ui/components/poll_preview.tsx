import classNames from 'classnames';
import React from 'react';

import { Poll as PollEntity, PollOption as PollOptionEntity } from 'soapbox/types/entities';

interface IPollPreview {
  poll: PollEntity,
}

const PollPreview: React.FC<IPollPreview> = ({ poll }) => {
  const renderOption = (option: PollOptionEntity, index: number) => {
    const showResults = poll.voted || poll.expired;

    return (
      <li key={index}>
        <label className={classNames('poll__text', { selectable: !showResults })}>
          <input
            name='vote-options'
            type={poll.multiple ? 'checkbox' : 'radio'}
            disabled
          />

          <span className={classNames('poll__input', { checkbox: poll.multiple })} />

          <span dangerouslySetInnerHTML={{ __html: option.title_emojified }} />
        </label>
      </li>
    );
  };

  if (!poll) {
    return null;
  }

  return (
    <div className='poll'>
      <ul>
        {poll.options.map((option, i) => renderOption(option, i))}
      </ul>
    </div>
  );
};

export default PollPreview;
