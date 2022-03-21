import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
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
