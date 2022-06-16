import classNames from 'classnames';
import React, { useState } from 'react';

import { openModal } from 'soapbox/actions/modals';
import { vote } from 'soapbox/actions/polls';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import { Stack } from '../ui';

import PollFooter from './poll-footer';
import PollOption from './poll-option';

export type Selected = Record<number, boolean>;

interface IPoll {
  id: string,
  status?: string,
}

const Poll: React.FC<IPoll> = ({ id, status }): JSX.Element | null => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => state.me);
  const poll = useAppSelector((state) => state.polls.get(id));

  const [selected, setSelected] = useState({} as Selected);

  const openUnauthorizedModal = () =>
    dispatch(openModal('UNAUTHORIZED', {
      action: 'POLL_VOTE',
      ap_id: status,
    }));

  const handleVote = (selectedId: number) => dispatch(vote(id, [selectedId]));

  const toggleOption = (value: number) => {
    if (isLoggedIn) {
      if (poll?.multiple) {
        const tmp = { ...selected };
        if (tmp[value]) {
          delete tmp[value];
        } else {
          tmp[value] = true;
        }
        setSelected(tmp);
      } else {
        const tmp: Selected = {};
        tmp[value] = true;
        setSelected(tmp);
        handleVote(value);
      }
    } else {
      openUnauthorizedModal();
    }
  };

  if (!poll) return null;

  const showResults = poll.voted || poll.expired;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onClick={e => e.stopPropagation()}>
      <Stack space={4} className={classNames('mt-4')}>
        <Stack space={2}>
          {poll.options.map((option, i) => (
            <PollOption
              key={i}
              poll={poll}
              option={option}
              index={i}
              showResults={showResults}
              active={!!selected[i]}
              onToggle={toggleOption}
            />
          ))}
        </Stack>

        <PollFooter
          poll={poll}
          showResults={showResults}
          selected={selected}
        />
      </Stack>
    </div>
  );
};

export default Poll;
