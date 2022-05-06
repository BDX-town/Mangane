import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { Text } from 'soapbox/components/ui';
import emojify from 'soapbox/features/emoji/emoji';
import { useSoapboxConfig, useOwnAccount, useFeatures } from 'soapbox/hooks';
import sourceCode from 'soapbox/utils/code';

interface IFooterLink {
  to: string,
  className?: string,
  onClick?: React.EventHandler<React.MouseEvent>,
}

const FooterLink: React.FC<IFooterLink> = ({ children, className, ...rest }): JSX.Element => {
  return (
    <Link className={classNames('text-gray-400 hover:text-gray-500 hover:underline', className)} {...rest}>{children}</Link>
  );
};

const LinkFooter: React.FC = (): JSX.Element => {
  const account = useOwnAccount();
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();

  const intl = useIntl();
  const dispatch = useDispatch();

  const onClickLogOut: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(logOut(intl));
    e.preventDefault();
  };

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center divide-x-dot'>
        {account && <>
          {features.profileDirectory && (
            <FooterLink to='/directory'><FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' /></FooterLink>
          )}
          <FooterLink to='/blocks'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></FooterLink>
          <FooterLink to='/mutes'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></FooterLink>
          {features.filters && (
            <FooterLink to='/filters'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></FooterLink>
          )}
          {features.federating && (
            <FooterLink to='/domain_blocks'><FormattedMessage id='navigation_bar.domain_blocks' defaultMessage='Domain blocks' /></FooterLink>
          )}
          {account.admin && (
            <FooterLink to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Soapbox config' /></FooterLink>
          )}
          {account.locked && (
            <FooterLink to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></FooterLink>
          )}
          {features.importAPI && (
            <FooterLink to='/settings/import'><FormattedMessage id='navigation_bar.import_data' defaultMessage='Import data' /></FooterLink>
          )}
          {(features.federating && features.accountMoving) && (
            <FooterLink to='/settings/migration'><FormattedMessage id='navigation_bar.account_migration' defaultMessage='Move account' /></FooterLink>
          )}
          <FooterLink to='/logout' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></FooterLink>
        </>}
      </div>

      <Text theme='muted' size='sm'>
        {soapboxConfig.linkFooterMessage ? (
          <span
            className='inline-block align-middle'
            dangerouslySetInnerHTML={{ __html: emojify(soapboxConfig.linkFooterMessage) }}
          />
        ) : (
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
            values={{
              code_name: sourceCode.displayName,
              code_link: <Text theme='subtle'><a className='underline' href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a></Text>,
              code_version: sourceCode.version,
            }}
          />
        )}
      </Text>
    </div>
  );
};

export default LinkFooter;
