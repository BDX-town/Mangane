import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { Spinner } from 'soapbox/components/ui';

/** Component that logs the user out when rendered */
const Logout: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [done, setDone] = useState(false);

  useEffect(() => {
    dispatch(logOut(intl) as any)
      .then(() => setDone(true))
      .catch(console.warn);
  }, []);

  if (done) {
    return <Redirect to='/' />;
  } else {
    return <Spinner />;
  }
};

export default Logout;
