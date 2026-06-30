import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Text } from 'soapbox/components/ui';
import emojify from 'soapbox/features/emoji/emoji';
import { useSoapboxConfig, useOwnAccount, useTheme } from 'soapbox/hooks';
import sourceCode from 'soapbox/utils/code';

//@ts-expect-error no typedef
import manganeDark from '../../../../icons/mangane-dark.svg';
//@ts-expect-error no typedef
import mangane from '../../../../icons/mangane.svg';

interface IFooterLink {
  children: ReactNode,
  to: string,
  className?: string,
  onClick?: React.EventHandler<React.MouseEvent>,
}

const FooterLink: React.FC<IFooterLink> = ({ children, className, ...rest }): JSX.Element => {
  return (
    <div>
      <Link className={classNames('text-xs text-gray-400 hover:text-gray-500 hover:underline', className)} {...rest}>{children}</Link>
    </div>
  );
};

const LinkFooter: React.FC = (): JSX.Element => {

  const account = useOwnAccount();
  const soapboxConfig = useSoapboxConfig();

  const darkMode = useTheme() === 'dark';

  return (
    <div className='space-y-2'>
      <Text theme='muted' size='xs'>
        {soapboxConfig.linkFooterMessage ? (
          <span
            className='inline-block align-middle'
            dangerouslySetInnerHTML={{ __html: emojify(soapboxConfig.linkFooterMessage) }}
          />
        ) : (
          <div className='mt-4 gap-2 text-right'>
            <img alt='Mangane logo' src={darkMode ? manganeDark : mangane} className='ml-auto mb-2 w-[24px] h-[24px] opacity-90' />
            <FormattedMessage
              id='getting_started.open_source_notice'
              defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} ({code_version}).'
              values={{
                code_name: sourceCode.displayName,
                code_link: <Text theme='subtle' size='xs'><a className='underline' href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a></Text>,
                code_version: sourceCode.version,
              }}
            />
          </div>
        )}
      </Text>
      <div className='flex flex-wrap items-center justify-center divide-x-dot text-gray-400'>
        {account && <>
          {account.admin && (
            <FooterLink to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Mangane config' /></FooterLink>
          )}
        </>}
      </div>
    </div>
  );
};

export default LinkFooter;
