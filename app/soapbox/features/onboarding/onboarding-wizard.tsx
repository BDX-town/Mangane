import classNames from 'classnames';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import ReactSwipeableViews from 'react-swipeable-views';

import { endOnboarding } from 'soapbox/actions/onboarding';
import LandingGradient from 'soapbox/components/landing-gradient';
import { HStack } from 'soapbox/components/ui';

import AvatarSelectionStep from './steps/avatar-selection-step';
import BioStep from './steps/bio-step';
import CompletedStep from './steps/completed-step';
import CoverPhotoSelectionStep from './steps/cover-photo-selection-step';
import DisplayNameStep from './steps/display-name-step';
import SuggestedAccountsStep from './steps/suggested-accounts-step';

const OnboardingWizard = () => {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const handleSwipe = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleComplete = () => {
    dispatch(endOnboarding());
  };

  const steps = [
    <AvatarSelectionStep onNext={handleNextStep} />,
    <DisplayNameStep onNext={handleNextStep} />,
    <BioStep onNext={handleNextStep} />,
    <CoverPhotoSelectionStep onNext={handleNextStep} />,
    <SuggestedAccountsStep onNext={handleNextStep} />,
    <CompletedStep onComplete={handleComplete} />,
  ];

  const handleKeyUp = ({ key }: KeyboardEvent): void => {
    switch (key) {
      case 'ArrowLeft':
        handlePreviousStep();
        break;
      case 'ArrowRight':
        handleNextStep();
        break;
    }
  };

  const handleDotClick = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  React.useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div data-testid='onboarding-wizard'>
      <LandingGradient />

      <main className='h-screen flex flex-col overflow-x-hidden'>
        <div className='flex flex-col justify-center items-center h-full'>
          <ReactSwipeableViews animateHeight index={currentStep} onChangeIndex={handleSwipe}>
            {steps.map((step, i) => (
              <div key={i} className='py-6 sm:mx-auto w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl'>
                <div
                  className={classNames({
                    'transition-opacity ease-linear': true,
                    'opacity-0 duration-500': currentStep !== i,
                    'opacity-100 duration-75': currentStep === i,
                  })}
                >
                  {step}
                </div>
              </div>
            ))}
          </ReactSwipeableViews>

          <HStack space={3} alignItems='center' justifyContent='center' className='relative'>
            {steps.map((_, i) => (
              <button
                key={i}
                tabIndex={0}
                onClick={() => handleDotClick(i)}
                className={classNames({
                  'w-5 h-5 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2': true,
                  'bg-gray-200 hover:bg-gray-300': i !== currentStep,
                  'bg-primary-600': i === currentStep,
                })}
              />
            ))}
          </HStack>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizard;
