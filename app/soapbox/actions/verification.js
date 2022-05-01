import api from '../api';

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

const ChallengeTypes = {
  EMAIL: 'email',
  SMS: 'sms',
  AGE: 'age',
};

/**
 * Fetch the state of the user's verification in local storage.
 *
 * @returns {object}
 * {
 *   token: String,
 *   challenges: {
 *     email: Number (0 = incomplete, 1 = complete),
 *     sms: Number,
 *     age: Number
 *   }
 * }
 */
function fetchStoredVerification() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VERIFICATION_KEY));
  } catch {
    return null;
  }
}

/**
 * Remove the state of the user's verification from local storage.
 */
function removeStoredVerification() {
  localStorage.removeItem(LOCAL_STORAGE_VERIFICATION_KEY);
}


/**
 * Fetch and return the Registration token for Pepe.
 * @returns {string}
 */
function fetchStoredToken() {
  try {
    const verification = fetchStoredVerification();
    return verification.token;
  } catch {
    return null;
  }
}

/**
 * Fetch and return the state of the verification challenges.
 * @returns {object}
 * {
 *   challenges: {
 *     email: Number (0 = incomplete, 1 = complete),
 *     sms: Number,
 *     age: Number
 *   }
 * }
 */
function fetchStoredChallenges() {
  try {
    const verification = fetchStoredVerification();
    return verification.challenges;
  } catch {
    return null;
  }
}

/**
 * Update the verification object in local storage.
 *
 * @param {*} verification object
 */
function updateStorage({ ...updatedVerification }) {
  const verification = fetchStoredVerification();

  localStorage.setItem(
    LOCAL_STORAGE_VERIFICATION_KEY,
    JSON.stringify({ ...verification, ...updatedVerification }),
  );
}

/**
 * Fetch Pepe challenges and registration token
 * @returns {promise}
 */
function fetchVerificationConfig() {
  return async(dispatch) => {
    await dispatch(fetchPepeInstance());

    dispatch(fetchRegistrationToken());
  };
}

/**
 * Save the challenges in localStorage.
 *
 * - If the API removes a challenge after the client has stored it, remove that
 *    challenge from localStorage.
 * - If the API adds a challenge after the client has stored it, add that
 *    challenge to localStorage.
 * - Don't overwrite a challenge that has already been completed.
 * - Update localStorage to the new set of challenges.
 *
 * @param {array} challenges - ['age', 'sms', 'email']
 */
function saveChallenges(challenges) {
  const currentChallenges = fetchStoredChallenges() || {};

  const challengesToRemove = Object.keys(currentChallenges).filter((currentChallenge) => !challenges.includes(currentChallenge));
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
 * @param {string} challenge - "sms" or "email" or "age"
 */
function finishChallenge(challenge) {
  const currentChallenges = fetchStoredChallenges() || {};
  // Set challenge to "complete"
  currentChallenges[challenge] = 1;

  updateStorage({ challenges: currentChallenges });
}

/**
 * Fetch the next challenge
 * @returns {string} challenge - "sms" or "email" or "age"
 */
function fetchNextChallenge() {
  const currentChallenges = fetchStoredChallenges() || {};
  return Object.keys(currentChallenges).find((challenge) => currentChallenges[challenge] === 0);
}

/**
 * Dispatch the next challenge or set to complete if all challenges are completed.
 */
function dispatchNextChallenge(dispatch) {
  const nextChallenge = fetchNextChallenge();

  if (nextChallenge) {
    dispatch({ type: SET_NEXT_CHALLENGE, challenge: nextChallenge });
  } else {
    dispatch({ type: SET_CHALLENGES_COMPLETE });
  }
}

/**
 * Fetch the challenges and age mininum from Pepe
 * @returns {promise}
 */
function fetchPepeInstance() {
  return (dispatch, getState) => {
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
}

/**
 * Fetch the regristration token from Pepe unless it's already been stored locally
 * @returns {promise}
 */
function fetchRegistrationToken() {
  return (dispatch, getState) => {
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
}

function checkEmailAvailability(email) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).get(`/api/v1/pepe/account/exists?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

/**
 * Send the user's email to Pepe to request confirmation
 * @param {string} email
 * @returns {promise}
 */
function requestEmailVerification(email) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_email/request', { email }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

function checkEmailVerification() {
  return (dispatch, getState) => {
    const token = fetchStoredToken();

    return api(getState).get('/api/v1/pepe/verify_email', {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
}

/**
 * Confirm the user's email with Pepe
 * @param {string} emailToken
 * @returns {promise}
 */
function confirmEmailVerification(emailToken) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_email/confirm', { token: emailToken }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(ChallengeTypes.EMAIL);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

function postEmailVerification() {
  return (dispatch, getState) => {
    finishChallenge(ChallengeTypes.EMAIL);
    dispatchNextChallenge(dispatch);
  };
}

/**
 * Send the user's phone number to Pepe to request confirmation
 * @param {string} phone
 * @returns {promise}
 */
function requestPhoneVerification(phone) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_sms/request', { phone }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

/**
 * Confirm the user's phone number with Pepe
 * @param {string} code
 * @returns {promise}
 */
function confirmPhoneVerification(code) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_sms/confirm', { code }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(ChallengeTypes.SMS);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

/**
 * Confirm the user's age with Pepe
 * @param {date} birthday
 * @returns {promise}
 */
function verifyAge(birthday) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/verify_age/confirm', { birthday }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        finishChallenge(ChallengeTypes.AGE);
        dispatchNextChallenge(dispatch);
      })
      .finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

/**
 * Create the user's account with Pepe
 * @param {string} username
 * @param {string} password
 * @returns {promise}
 */
function createAccount(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });

    const token = fetchStoredToken();

    return api(getState).post('/api/v1/pepe/accounts', { username, password }, {
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => dispatch({ type: SET_LOADING, value: false }));
  };
}

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
  requestPhoneVerification,
  verifyAge,
};
