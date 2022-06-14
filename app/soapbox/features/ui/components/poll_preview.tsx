import classNames from 'classnames';
import React from 'react';

import { Stack } from 'soapbox/components/ui';
import { Poll as PollEntity, PollOption as PollOptionEntity } from 'soapbox/types/entities';

interface IPollPreview {
  poll: PollEntity,
}


// {/* <li key={index}>
//   <label className={classNames('poll__text', { selectable: !showResults })}>
//     <input
//       name='vote-options'
//       type={poll.multiple ? 'checkbox' : 'radio'}
//       disabled
//     />

//     <span className={classNames('poll__input', { checkbox: poll.multiple })} />

//     <span dangerouslySetInnerHTML={{ __html: option.title_emojified }} />
//   </label>
// </li> */}

const PollPreview: React.FC<IPollPreview> = ({ poll }) => {
  const renderOption = (option: PollOptionEntity, index: number) => {
    const showResults = poll.voted || poll.expired;

    return (
      <label className='rounded-tl-md rounded-tr-md relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none'>
        <span className='flex items-center text-sm'>
          <input type='radio' name='pricing-plan' value='Startup' className='h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500' aria-labelledby='pricing-plans-0-label' aria-describedby='pricing-plans-0-description-0 pricing-plans-0-description-1' />
          <span id='pricing-plans-0-label' className='ml-3 font-medium'>Startup</span>
        </span>
        <span id='pricing-plans-0-description-0' className='ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center'>
          <span className='font-medium'>$29 / mo</span>
          <span>($290 / yr)</span>
        </span>
        <span id='pricing-plans-0-description-1' className='ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right'>Up to 5 active job postings</span>
      </label>
    );
  };

  if (!poll) {
    return null;
  }

  return (
    <Stack>
      {poll.options.map((option, i) => renderOption(option, i))}
    </Stack>
  );
};

export default PollPreview;
