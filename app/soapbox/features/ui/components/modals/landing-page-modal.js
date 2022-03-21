import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Button } from 'soapbox/components/ui';
import { Modal } from 'soapbox/components/ui';

const messages = defineMessages({
  download: { id: 'landing_page_modal.download', defaultMessage: 'Download' },
  helpCenter: { id: 'landing_page_modal.helpCenter', defaultMessage: 'Help Center' },
  login: { id: 'header.login.label', defaultMessage: 'Log in' },
  register: { id: 'header.register.label', defaultMessage: 'Register' },
});

const LandingPageModal = ({ onClose }) => {
  const intl = useIntl();

  const logo = useSelector((state) => getSoapboxConfig(state).get('logo'));
  const instance = useSelector((state) => state.get('instance'));
  const isOpen = instance.get('registrations', false) === true;

  return (
    <Modal
      title={<img alt='Logo' src={logo} className='h-4 w-auto' />}
      onClose={() => onClose('LANDING_PAGE')}
    >
      <div className='mt-4 divide-y divide-solid divide-gray-200'>
        <nav className='grid gap-y-8 mb-6'>
          <a
            href='https://apps.apple.com/us/app/truth-social/id1586018825'
            target='_blank'
            className='-m-3 p-3 flex items-center rounded-md hover:bg-gray-50'
          >
            <InlineSVG src={require('@tabler/icons/icons/download.svg')} className='flex-shrink-0 h-6 w-6 text-gray-400' />

            <span className='ml-3 text-base font-medium text-gray-900'>
              {intl.formatMessage(messages.download)}
            </span>
          </a>

          <a
            href='#'
            target='_blank'
            className='-m-3 p-3 flex items-center rounded-md hover:bg-gray-50'
          >
            <InlineSVG src={require('@tabler/icons/icons/lifebuoy.svg')} className='flex-shrink-0 h-6 w-6 text-gray-400' />

            <span className='ml-3 text-base font-medium text-gray-900'>
              {intl.formatMessage(messages.helpCenter)}
            </span>
          </a>
        </nav>

        <div
          className={classNames('pt-6 grid gap-4', {
            'grid-cols-2': isOpen,
            'grid-cols-1': !isOpen,
          })}
        >
          <Button to='/login' theme='secondary' block>
            {intl.formatMessage(messages.login)}
          </Button>

          {isOpen && (
            <Button to='/auth/verify' theme='primary' block>
              {intl.formatMessage(messages.register)}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

LandingPageModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LandingPageModal;
