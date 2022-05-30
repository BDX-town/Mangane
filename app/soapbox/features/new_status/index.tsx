import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import { useAppDispatch } from 'soapbox/hooks';

const NewStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openModal('COMPOSE'));
  }, []);

  return (
    <Redirect to='/' />
  );
};

export default NewStatus;
