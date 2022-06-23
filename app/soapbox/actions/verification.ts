import api from '../api';

import type { AppDispatch, RootState } from 'soapbox/store';

/**
 * LocalStorage 'soapbox:verification'
 *
 * {
 *   token: String,
 *   challenges: {
 *     email: Number (0 = incomplete, 1 = complete),
 *     sms: Number,
 *     age: Number
 *   }
 * }
 */
const LOCAL_STORAGE_VERIFICATION_KEY = 'soapbox:verification';

const PEPE_FETCH_INSTANCE_SUCCESS = 'PEPE_FETCH_INSTANCE_SUCCESS';
const FETCH_CHALLENGES_SUCCESS = 'FETCH_CHALLENGES_SUCCESS';
const FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS';

const SET_NEXT_CHALLENGE = 'SET_NEXT_CHALLENGE';
const SET_CHALLENGES_COMPLETE = 'SET_CHALLENGES_COMPLETE';
const SET_LOADING = 'SET_LOADING';

const EMAIL: Challenge = 'email';
const SMS: Challenge = 'sms';
const AGE: Challenge = 'age';

export type Challenge = 'age' | 'sms' | 'email'

type Challenges = {
  email?: 0 | 1,
  sms?: number,
  age?: number,
}

type Verification = {
  token?: string,
  challenges?: Challenges,
};

/**
 * Fetch the state of the user's verification in local storage.
 */
const fetchStoredVerification = (): Verification | null => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VERIFICATION_KEY) as string);
  } catch {
    return null;
  }
};

/**
 * Remove the state of the user's verification from local storage.
 */
const removeStoredVerification = () => {
  localStorage.removeItem(LOCAL_STORAGE_VERIFICATION_KEY);
};

/**
 * Fetch and return the Registration token for Pepe.
 */
const fetchStoredToken = () => {
  try {
    const verification: Verification | null = fetchStoredVerification();
    return verification!.token;
  } catch {
    return null;
  }
};

/**
 * Fetch and return the state of the verification challenges.
 */
const fetchStoredChallenges = () => {
  try {
    const verification: Verification | null = fetchStoredVerification();
    return verification!.challenges;
  } catch {
    return null;
  }
};

/**
 * Update the verification object in local storage.
 *
 * @param {*} verification object
 */
const updateStorage = ({ ...updatedVerification }: Verification) => {
  const verification = fetchStoredVerification();

  localStorage.setItem(
    LOCAL_STORAGE_VERIFICATION_KEY,
    JSON.stringify({ ...verification, ...updatedVerification }),
  );
};

/**
 * Fetch Pepe challenges and registration token
 */
const fetchVerificationConfig = () =>
  async(dispatch: AppDispatch) => {
    await dispatch(fetchPepeInstance());

    dispatch(fetchRegistrationToken());
  };

/**
 * Save the challenges in localStorage.
 *
 * - If the API removes a challenge after the client has stored it, remove that
 *    challenge from localStorage.
 * - If the API adds a challenge after the client has stored it, add that
 *    challenge to localStorage.
 * - Don't overwrite a challenge that has already been completed.
 * - Update localStorage to the new set of challenges.
 */
function saveChallenges(challenges: Array<'age' | 'sms' | 'email'>) {
  const currentChallenges: Challenges = fetchStoredChallenges() || {};

  const challengesToRemove = Object.keys(currentChallenges).filter((currentChallenge) => !challenges.includes(currentChallenge as Challenge)) as Challenge[];
  challengesToRemove.forEach((challengeToRemove) => delete currentChallenges[challengeToRemove]);

  for (let i = 0; i < challenges.length; i++) {
    const challengeName = challenges[i];

    if (typeof currentChallenges[challengeName] !== 'number') {
      currentChallenges[challengeName] = 0;
    }
  }

  updateStorage({ challenges: currentChallenges });
}

/**
 * Finish a challenge.
 */
function finishChallenge(challenge: Challenge) {
  const currentChallenges: Challenges = fetchStoredChallenges() || {};
  // Set challenge to "complete"
  currentChallenges[challenge] = 1;

  updateStorage({ challenges: currentChallenges });
}

/**
 * Fetch the next challenge
 */
const fetchNextChallenge = (): Challenge => {
  const currentChallenges: Challenges = fetchStoredChallenges() || {};
  return Object.keys(currentChallenges).find((challenge) => currentChallenges[challenge as Challenge] === 0) as Challenge;
};

/**
 * Dispatch the next challenge or set to complete if all challenges are completed.
 */
const dispatchNextChallenge = (dispatch: AppDispatch) => {
  const nextChallenge = fetchNextChallenge();

  if (nextChallenge) {
    dispatch({ type: SET_NEXT_CHALLENGE, challenge: nextChallenge });
  } else {
    dispatch({ type: SET_CHALLENGES_COMPLETE });
  }
};

/**
 * Fetch the challenges and age mininum from Pepe
 */
const fetchPepeInstance = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    return api(getState).get('/api/v1/pepe/instance').then(response => {
      const { challenges, age_minimum: ageMinimum } = response.data;
      saveChallenges(challenges);
      const currentChallenge = fetchNextChallenge();

      dispatch({ type: PEPE_FETCH_INSTANCE_SUCCESS, instance: { isReady: true, ...response.data } });

      dispatch({
        type: FETCH_CHALLENGES_SUCCESS,
        ageMinimum,
        currentChallenge,
        isComplete: !currentChallenge,
      });
    })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Fetch the regristration token from Pepe unless it's already been stored locally
 */
const fetchRegistrationToken = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();
    if (token) {
      dispatch({
        type: FETCH_TOKEN_SUCCESS,
        value: token,
      });
      return null;
    }

    return api(getState).post('/api/v1/pepe/registrations')
      .then(response => {
        updateStorage({ token: response.data.access_token });

        return dispatch({
          type: FETCH_TOKEN_SUCCESS,
          value: response.data.access_token,
        });
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

const checkEmailAvailability = (email: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).get(`/api/v1/pepe/account/exists?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .catch(() => {})
      .then(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Send the user's email to Pepe to request confirmation
 */
const requestEmailVerification = (email: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_email/request', { email }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

const checkEmailVerification = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const token = fetchStoredToken();

    return api(getState).get('/api/v1/pepe/verify_email', {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

/**
 * Confirm the user's email with Pepe
 */
const confirmEmailVerification = (emailToken: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_email/confirm', { token: emailToken }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(EMAIL);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

const postEmailVerification = () =>
  (dispatch: AppDispatch) => {
    finishChallenge(EMAIL);
    dispatchNextChallenge(dispatch);
  };

/**
 * Send the user's phone number to Pepe to request confirmation
 */
const requestPhoneVerification = (phone: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_sms/request', { phone }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Send the user's phone number to Pepe to re-request confirmation
 */
const reRequestPhoneVerification = (phone: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    return api(getState).post('/api/v1/pepe/reverify_sms/request', { phone })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Confirm the user's phone number with Pepe
 */
const confirmPhoneVerification = (code: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_sms/confirm', { code }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(SMS);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Re-Confirm the user's phone number with Pepe
 */
const reConfirmPhoneVerification = (code: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    return api(getState).post('/api/v1/pepe/reverify_sms/confirm', { code })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Confirm the user's age with Pepe
 */
const verifyAge = (birthday: Date) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_age/confirm', { birthday }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(AGE);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

/**
 * Create the user's account with Pepe
 */
const createAccount = (username: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/accounts', { username, password }, {
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => dispatch({ type: SET_LOADING, value: false }));
  };

export {
  PEPE_FETCH_INSTANCE_SUCCESS,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_TOKEN_SUCCESS,
  LOCAL_STORAGE_VERIFICATION_KEY,
  SET_CHALLENGES_COMPLETE,
  SET_LOADING,
  SET_NEXT_CHALLENGE,
  checkEmailAvailability,
  confirmEmailVerification,
  confirmPhoneVerification,
  createAccount,
  fetchStoredChallenges,
  fetchVerificationConfig,
  fetchRegistrationToken,
  removeStoredVerification,
  requestEmailVerification,
  checkEmailVerification,
  postEmailVerification,
  reConfirmPhoneVerification,
  requestPhoneVerification,
  reRequestPhoneVerification,
  verifyAge,
};
