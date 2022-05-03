const ONBOARDING_START = 'ONBOARDING_START';
const ONBOARDING_END = 'ONBOARDING_END';

const ONBOARDING_LOCAL_STORAGE_KEY = 'soapbox:onboarding';

type OnboardingStartAction = {
  type: typeof ONBOARDING_START
}

type OnboardingEndAction = {
  type: typeof ONBOARDING_END
}

export type OnboardingActions = OnboardingStartAction | OnboardingEndAction

const checkOnboardingStatus = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  const needsOnboarding = localStorage.getItem(ONBOARDING_LOCAL_STORAGE_KEY) === '1';

  if (needsOnboarding) {
    dispatch({ type: ONBOARDING_START });
  }
};

const startOnboarding = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, '1');
  dispatch({ type: ONBOARDING_START });
};

const endOnboarding = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  localStorage.removeItem(ONBOARDING_LOCAL_STORAGE_KEY);
  dispatch({ type: ONBOARDING_END });
};

export {
  ONBOARDING_END,
  ONBOARDING_START,
  checkOnboardingStatus,
  endOnboarding,
  startOnboarding,
};
