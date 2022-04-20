import { changeSettingImmediate } from 'soapbox/actions/settings';

/** Repeat the onboading process when we bump the version */
export const ONBOARDING_VERSION = 1;

/** Finish onboarding and store the setting */
const endOnboarding = () => (dispatch: React.Dispatch<any>) => {
  dispatch(changeSettingImmediate(['onboardingVersion'], ONBOARDING_VERSION));
};

export {
  endOnboarding,
};
