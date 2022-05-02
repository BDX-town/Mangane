import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchVerificationConfig } from 'soapbox/actions/verification';
import { useAppSelector } from 'soapbox/hooks';

import Registration from './registration';
import AgeVerification from './steps/age-verification';
import EmailVerification from './steps/email-verification';
import SmsVerification from './steps/sms-verification';

enum ChallengeTypes {
  EMAIL = 'email',
  SMS = 'sms',
  AGE = 'age',
}

const verificationSteps = {
  email: EmailVerification,
  sms: SmsVerification,
  age: AgeVerification,
};

const Verification = () => {
  const dispatch = useDispatch();

  const isInstanceReady = useAppSelector((state) => state.verification.getIn(['instance', 'isReady'], false) === true);
  const isRegistrationOpen = useAppSelector(state => state.verification.getIn(['instance', 'registrations'], false) === true);
  const currentChallenge = useAppSelector((state) => state.verification.getIn(['currentChallenge']) as ChallengeTypes);
  const isVerificationComplete = useAppSelector((state) => state.verification.get('isComplete'));
  const StepToRender = verificationSteps[currentChallenge];

  React.useEffect(() => {
    dispatch(fetchVerificationConfig());
  }, []);

  if (isInstanceReady && !isRegistrationOpen) {
    return <Redirect to='/' />;
  }

  if (isVerificationComplete) {
    return (
      <Registration />
    );
  }

  if (!currentChallenge) {
    return null;
  }

  return (
    <StepToRender />
  );
};

export default Verification;
