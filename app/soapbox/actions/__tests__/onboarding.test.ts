import { getSettings } from 'soapbox/actions/settings';
import { createTestStore, rootState } from 'soapbox/jest/test-helpers';

import { ONBOARDING_VERSION, endOnboarding } from '../onboarding';

describe('endOnboarding()', () => {
  it('updates the onboardingVersion setting', async() => {
    const store = createTestStore(rootState);

    // Sanity check:
    // `onboardingVersion` should be `0` by default
    const initialVersion = getSettings(store.getState()).get('onboardingVersion');
    expect(initialVersion).toBe(0);

    await store.dispatch(endOnboarding());

    // After dispatching, `onboardingVersion` is updated
    const updatedVersion = getSettings(store.getState()).get('onboardingVersion');
    expect(updatedVersion).toBe(ONBOARDING_VERSION);

    // Sanity check: `updatedVersion` is greater than `initialVersion`
    expect(updatedVersion > initialVersion).toBe(true);
  });
});
