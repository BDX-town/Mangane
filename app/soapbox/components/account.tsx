import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';

import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import VerificationBadge from 'soapbox/components/verification_badge';
import ActionButton from 'soapbox/features/ui/components/action-button';
import { useAppSelector, useOnScreen } from 'soapbox/hooks';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';

import RelativeTimestamp from './relative_timestamp';
import { Avatar, HStack, Icon, IconButton, Text } from './ui';

import type { Account as AccountEntity } from 'soapbox/types/entities';

interface IInstanceFavicon {
  account: AccountEntity,
}

const InstanceFavicon: React.FC<IInstanceFavicon> = ({ account }) => {
  const history = useHistory();

  const handleClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    history.push(`/timeline/${account.domain}`);
  };

  return (
    <button className='w-4 h-4 flex-none' onClick={handleClick}>
      <img src={account.favicon} alt='' title={account.domain} className='w-full max-h-full' />
    </button>
  );
};

interface IProfilePopper {
  condition: boolean,
  wrapper: (children: any) => React.ReactElement<any, any>
}

const ProfilePopper: React.FC<IProfilePopper> = ({ condition, wrapper, children }): any =>
  condition ? wrapper(children) : children;

interface IAccount {
  account: AccountEntity,
  action?: React.ReactElement,
  actionAlignment?: 'center' | 'top',
  actionIcon?: string,
  actionTitle?: string,
  /** Override other actions for specificity like mute/unmute.  */
  actionType?: 'muting' | 'blocking',
  avatarSize?: number,
  hidden?: boolean,
  hideActions?: boolean,
  id?: string,
  onActionClick?: (account: any) => void,
  showProfileHoverCard?: boolean,
  timestamp?: string | Date,
  timestampUrl?: string,
  withDate?: boolean,
  withRelationship?: boolean,
  showEdit?: boolean,
}

const Account = ({
  account,
  actionType,
  action,
  actionIcon,
  actionTitle,
  actionAlignment = 'center',
  avatarSize = 42,
  hidden = false,
  hideActions = false,
  onActionClick,
  showProfileHoverCard = true,
  timestamp,
  timestampUrl,
  withDate = false,
  withRelationship = true,
  showEdit = false,
}: IAccount) => {
  const overflowRef = React.useRef<HTMLDivElement>(null);
  const actionRef = React.useRef<HTMLDivElement>(null);
  // @ts-ignore
  const isOnScreen = useOnScreen(overflowRef);

  const [style, setStyle] = React.useState<React.CSSProperties>({ visibility: 'hidden' });

  const me = useAppSelector((state) => state.me);
  const username = useAppSelector((state) => account ? getAcct(account, displayFqn(state)) : null);

  const handleAction = () => {
    // @ts-ignore
    onActionClick(account);
  };

  const renderAction = () => {
    if (action) {
      return action;
    }

    if (hideActions) {
      return null;
    }

    if (onActionClick && actionIcon) {
      return (
        <IconButton
          src={actionIcon}
          title={actionTitle}
          onClick={handleAction}
          className='bg-transparent text-gray-400 hover:text-gray-600'
          iconClassName='w-4 h-4'
        />
      );
    }

    if (account.id !== me) {
      return <ActionButton account={account} actionType={actionType} />;
    }

    return null;
  };

  React.useEffect(() => {
    const style: React.CSSProperties = {};
    const actionWidth = actionRef.current?.clientWidth || 0;

    if (overflowRef.current) {
      style.maxWidth = overflowRef.current.clientWidth - 30 - avatarSize - actionWidth;
    } else {
      style.visibility = 'hidden';
    }

    setStyle(style);
  }, [isOnScreen, overflowRef, actionRef]);

  if (!account) {
    return null;
  }

  if (hidden) {
    return (
      <>
        {account.display_name}
        {account.username}
      </>
    );
  }

  if (withDate) timestamp = account.created_at;

  const LinkEl: any = showProfileHoverCard ? Link : 'div';

  return (
    <div data-testid='account' className='flex-shrink-0 group block w-full' ref={overflowRef}>
      <HStack alignItems={actionAlignment} justifyContent='between'>
        <HStack alignItems='center' space={3} grow>
          <ProfilePopper
            condition={showProfileHoverCard}
            wrapper={(children) => <HoverRefWrapper accountId={account.id} inline>{children}</HoverRefWrapper>}
          >
            <LinkEl
              to={`/@${account.acct}`}
              title={account.acct}
              onClick={(event: React.MouseEvent) => event.stopPropagation()}
            >
              <Avatar src={account.avatar} size={avatarSize} />
            </LinkEl>
          </ProfilePopper>

          <div className='flex-grow'>
            <ProfilePopper
              condition={showProfileHoverCard}
              wrapper={(children) => <HoverRefWrapper accountId={account.id} inline>{children}</HoverRefWrapper>}
            >
              <LinkEl
                to={`/@${account.acct}`}
                title={account.acct}
                onClick={(event: React.MouseEvent) => event.stopPropagation()}
              >
                <div className='flex items-center space-x-1 flex-grow' style={style}>
                  <Text
                    size='sm'
                    weight='semibold'
                    truncate
                    dangerouslySetInnerHTML={{ __html: account.display_name_html }}
                  />

                  {account.verified && <VerificationBadge />}
                </div>
              </LinkEl>
            </ProfilePopper>

            <HStack alignItems='center' space={1} style={style}>
              <Text theme='muted' size='sm' truncate>@{username}</Text>

              {account.favicon && (
                <InstanceFavicon account={account} />
              )}

              {(timestamp) ? (
                <>
                  <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                  {timestampUrl ? (
                    <Link to={timestampUrl} className='hover:underline'>
                      <RelativeTimestamp timestamp={timestamp} theme='muted' size='sm' className='whitespace-nowrap' />
                    </Link>
                  ) : (
                    <RelativeTimestamp timestamp={timestamp} theme='muted' size='sm' className='whitespace-nowrap' />
                  )}
                </>
              ) : null}

              {showEdit ? (
                <>
                  <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                  <Icon className='h-5 w-5 stroke-[1.35]' src={require('@tabler/icons/icons/pencil.svg')} />
                </>
              ) : null}
            </HStack>
          </div>
        </HStack>

        <div ref={actionRef}>
          {withRelationship ? renderAction() : null}
        </div>
      </HStack>
    </div>
  );
};

export default Account;
