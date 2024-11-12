import React from 'react';

import { Account, Mention as MentionType } from 'soapbox/types/entities';


export const Mention = ({ mention, account }: { mention: MentionType, account: Account}) => {
  return (
    <a className='inline-flex items-center gap-1 p-1 rounded-full bg-primary-100 !text-gray-800' href={`/@${mention.acct}`} title={mention.acct} rel='nofollow noopener'>
      <img className='!m-0 !rounded-full' src={account?.avatar} aria-hidden alt='' style={{ width: '20px', height: '20px' }} />
      {mention.username}
    </a>
  );
};