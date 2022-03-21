import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchVerificationConfig } from 'soapbox/actions/verification';

import Registration from './registration';
import AgeVerification from './steps/age_verification';
import EmailVerification from './steps/email_verification';
import SmsVerification from './steps/sms_verification';

const verificationSteps = {
  email: EmailVerification,
  sms: SmsVerification,
  age: AgeVerification,
};

const Verification = () => {
  const dispatch = useDispatch();

  const isInstanceReady = useSelector((state) => state.getIn(['verification', 'instance', 'isReady'], false) === true);
  const isRegistrationOpen = useSelector(state => state.getIn(['verification', 'instance', 'registrations'], false) === true);
  const currentChallenge = useSelector((state) => state.getIn(['verification', 'currentChallenge']));
  const isVerificationComplete = useSelector((state) => state.getIn(['verification', 'isComplete']));
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
