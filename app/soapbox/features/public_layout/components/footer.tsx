import { List as ImmutableList } from 'immutable';
import React from 'react';
import { Link } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import type { FooterItem } from 'soapbox/types/soapbox';

const Footer = () => {
  const { copyright, navlinks, locale } = useAppSelector((state) => {
    const soapboxConfig = getSoapboxConfig(state);

    return {
      copyright: soapboxConfig.copyright,
      navlinks: (soapboxConfig.navlinks.get('homeFooter') || ImmutableList()) as ImmutableList<FooterItem>,
      locale: getSettings(state).get('locale') as string,
    };
  });

  return (
    <footer className='relative max-w-7xl mt-auto mx-auto py-12 px-4 sm:px-6 xl:flex xl:items-center xl:justify-between lg:px-8'>
      <div className='flex flex-wrap justify-center'>
        {navlinks.map((link, idx) => {
          const url = link.get('url');
          const isExternal = url.startsWith('http');
          const Comp = (isExternal ? 'a' : Link) as 'a';
          const compProps = isExternal ? { href: url, target: '_blank' } : { to: url };

          return (
            <div key={idx} className='px-5 py-2'>
              <Comp {...compProps} className='text-primary-600 dark:text-primary-400 hover:underline'>
                <Text tag='span' theme='inherit' size='sm'>
                  {(link.getIn(['titleLocales', locale]) || link.get('title')) as string}
                </Text>
              </Comp>
            </div>
          );
        })}
      </div>

      <div className='mt-6 xl:mt-0'>
        <Text theme='muted' align='center' size='sm'>{copyright}</Text>
      </div>
    </footer>
  );
};

export default Footer;
