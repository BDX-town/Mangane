import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { openModal } from 'soapbox/actions/modals';
import LandingGradient from 'soapbox/components/landing-gradient';
import SiteLogo from 'soapbox/components/site-logo';
import { Button, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector, useOwnAccount } from 'soapbox/hooks';

const WaitlistPage = (/* { account } */) => {
  const dispatch = useDispatch();
  const title = useAppSelector((state) => state.instance.title);

  const me = useOwnAccount();
  const isSmsVerified = me?.source.get('sms_verified');

  const onClickLogOut: React.MouseEventHandler = (event) => {
    event.preventDefault();
    dispatch(logOut());
  };

  const openVerifySmsModal = () => dispatch(openModal('VERIFY_SMS'));

  useEffect(() => {
    if (!isSmsVerified) {
      openVerifySmsModal();
    }
  }, []);

  return (
    <div>
      <LandingGradient />

      <main className='relative flex flex-col h-screen max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <header className='relative flex justify-between h-16'>
          <div className='flex-1 flex items-stretch justify-center relative'>
            <Link to='/' className='cursor-pointer flex-shrink-0 flex items-center'>
              <SiteLogo alt='Logo' className='h-7' />
            </Link>

            <div className='absolute inset-y-0 right-0 flex items-center pr-2 space-x-3'>
              <Button onClick={onClickLogOut} theme='primary' to='/logout'>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <div className='-mt-16 flex flex-col justify-center items-center h-full'>
          <div className='max-w-xl'>
            <Stack space={4}>
              <img src='/instance/images/waitlist.png' className='mx-auto w-32 h-32' alt='Waitlisted' />

              <Stack space={2}>
                <Text size='lg' theme='muted' align='center' weight='medium'>
                  Welcome back to {title}! You were previously placed on our
                  waitlist. Please verify your phone number to receive
                  immediate access to your account!
                </Text>

                <div className='text-center'>
                  <Button onClick={openVerifySmsModal} theme='primary'>Verify phone number</Button>
                </div>
              </Stack>
            </Stack>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitlistPage;
