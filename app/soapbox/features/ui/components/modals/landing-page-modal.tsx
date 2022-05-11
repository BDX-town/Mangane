import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Button } from 'soapbox/components/ui';
import { Modal } from 'soapbox/components/ui';
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

const LandingPageModal: React.FC<ILandingPageModal> = ({ onClose }) => {
  const intl = useIntl();

  const soapboxConfig = useSoapboxConfig();
  const pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;

  const { logo } = soapboxConfig;
  const instance = useAppSelector((state) => state.instance);
  const features = useFeatures();

  const isOpen   = features.accountCreation && instance.registrations;
  const pepeOpen = useAppSelector(state => state.verification.getIn(['instance', 'registrations'], false) === true);

  return (
    <Modal
      title={<img alt='Logo' src={logo} className='h-4 w-auto' />}
      onClose={() => onClose('LANDING_PAGE')}
    >
      <div className='mt-4 divide-y divide-solid divide-gray-200 dark:divide-slate-700'>
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
            <Button to={pepeEnabled ? '/verify' : '/signup'} theme='primary' block>
              {intl.formatMessage(messages.register)}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LandingPageModal;
