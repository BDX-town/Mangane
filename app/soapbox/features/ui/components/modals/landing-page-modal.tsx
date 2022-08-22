import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import SiteLogo from 'soapbox/components/site-logo';
import { Text, Button, Icon, Modal } from 'soapbox/components/ui';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

const messages = defineMessages({
  download: { id: 'landing_page_modal.download', defaultMessage: 'Download' },
  helpCenter: { id: 'landing_page_modal.helpCenter', defaultMessage: 'Help Center' },
  login: { id: 'header.login.label', defaultMessage: 'Log in' },
  register: { id: 'header.register.label', defaultMessage: 'Register' },
});

interface ILandingPageModal {
  onClose: (type: string) => void,
}

/** Login and links to display from the hamburger menu of the homepage. */
const LandingPageModal: React.FC<ILandingPageModal> = ({ onClose }) => {
  const intl = useIntl();

  const soapboxConfig = useSoapboxConfig();
  const pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;
  const { links } = soapboxConfig;

  const instance = useAppSelector((state) => state.instance);
  const features = useFeatures();

  const isOpen = features.accountCreation && instance.registrations;
  const pepeOpen = useAppSelector(state => state.verification.instance.get('registrations') === true);

  return (
    <Modal
      title={<SiteLogo alt='Logo' className='h-6 w-auto cursor-pointer' />}
      onClose={() => onClose('LANDING_PAGE')}
    >
      <div className='mt-4 divide-y divide-solid divide-gray-200 dark:divide-slate-700'>
        {links.get('help') && (
          <nav className='grid gap-y-8 mb-6'>
            <a
              href={links.get('help')}
              target='_blank'
              className='p-3 space-x-3 flex items-center rounded-md dark:hover:bg-slate-900/50 hover:bg-gray-50'
            >
              <Icon src={require('@tabler/icons/lifebuoy.svg')} className='flex-shrink-0 h-6 w-6 text-gray-600 dark:text-gray-700' />

              <Text weight='medium'>
                {intl.formatMessage(messages.helpCenter)}
              </Text>
            </a>
          </nav>
        )}

        <div
          className={classNames('pt-6 grid gap-4', {
            'grid-cols-2': isOpen,
            'grid-cols-1': !isOpen,
          })}
        >
          <Button to='/login' theme='secondary' block>
            {intl.formatMessage(messages.login)}
          </Button>

          {(isOpen || pepeEnabled && pepeOpen) && (
            <Button to='/signup' theme='primary' block>
              {intl.formatMessage(messages.register)}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LandingPageModal;
