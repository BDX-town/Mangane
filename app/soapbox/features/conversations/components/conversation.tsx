import React, { useCallback, useMemo } from 'react';
import { HotKeys } from 'react-hotkeys';
import { useHistory } from 'react-router-dom';
import { accountSearch } from 'soapbox/actions/accounts';


import { markConversationRead } from 'soapbox/actions/conversations';
import Account, { ProfilePopper } from 'soapbox/components/account';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { Avatar, Icon } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { Account as AccountEntity, Status } from 'soapbox/types/entities';

interface IConversation {
  className?: string,
  conversationId: string,
  onMoveUp: (id: string) => void,
  onMoveDown: (id: string) => void,
  /** Absolute position of this conversation within the list, used for keyboard navigation. */
  index?: number,
}

const Conversation: React.FC<IConversation> = ({ conversationId, onMoveUp, onMoveDown, className, index }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { accounts, unread, lastStatusId, lastStatus } = useAppSelector((state) => {
    const conversation = state.conversations.items.find(x => x.id === conversationId)!;

    return {
      accounts: conversation.accounts.map((accountId: string) => state.accounts.get<AccountEntity>(accountId, null)!),
      unread: conversation.unread,
      lastStatus: state.statuses.get<Status>(conversation.last_status, null)!,
      lastStatusId: conversation.last_status || null,
    };
  });

  const handleClick = useCallback(() => {
    if (unread) {
      dispatch(markConversationRead(conversationId));
    }
    history.push(`/statuses/${lastStatusId}`);
  }, [conversationId, dispatch, history, lastStatusId, unread]);

  const handleHotkeyMoveUp = useCallback(() => {
    onMoveUp(conversationId);
  }, [conversationId, onMoveUp]);

  const handleHotkeyMoveDown = useCallback(() => {
    onMoveDown(conversationId);
  }, [conversationId, onMoveDown]);

  const handlers = useMemo(() => {
    return {
      open: handleClick,
      moveUp: handleHotkeyMoveUp,
      moveDown: handleHotkeyMoveDown,
    };
  }, [handleClick, handleHotkeyMoveDown, handleHotkeyMoveUp]);

  const accountsCount = useMemo(() => accounts.count(), [accounts]);

  if (lastStatusId === null) {
    return null;
  }

  return (
    <HotKeys handlers={handlers} data-testid='status'>
      <div onClick={handleClick} role='button' tabIndex={0} data-index={index} className={`bg-white dark:bg-slate-800 px-4 py-6 sm:shadow-sm dark:shadow-inset sm:p-5 rounded-xl ${className}`}>
        <div className='flex items-center gap-3'>
          <Icon
            src={require('@tabler/icons/messages.svg')}
            count={unread ? 1 : 0}
            className='h-6 w-6 text-gray-300 dark:text-gray-700'
          />
          <div className='flex justify-between items-start shrink min-w-0 grow'>
            <div className='flex gap-2 items-center shrink min-w-0 grow'>
              {accountsCount === 1 ? (
                <Account avatarSize={32} withLinkToProfile={false} account={accounts.get(0)} />
              ) : (
                <>
                  {
                    [...accounts, ...accounts, ...accounts, ...accounts, ...accounts].slice(0, 3).map((account) => (
                      <ProfilePopper
                        condition
                        wrapper={(children) => <HoverRefWrapper className='relative' accountId={account.id} inline>{children}</HoverRefWrapper>}
                      >
                        <Avatar src={account.avatar} size={32} />
                      </ProfilePopper>
                    ))
                  }
                  {
                    accountsCount > 3 && <span>+{accountsCount - 3}</span>
                  }
                </>
              )
              }
            </div>
            <div className='text-gray-500 dark:text-gray-200 flex gap-2 items-center grow justify-end'>
              {new Date(lastStatus.get('created_at')).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className='flex justify-between mt-3 items-end gap-2'>
          <div style={{ 'whiteSpace': 'nowrap' }} className='overflow-x-hidden text-ellipsis text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: lastStatus.contentHtml.replace(/<br ?\/?>/g, ' ') }} />
        </div>

      </div>
    </HotKeys>
  );
};

export default Conversation;
