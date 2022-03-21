import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import Account from '../../../components/account';
import { makeGetAccount } from '../../../selectors';

const AutosuggestAccount = ({ id }) => {
  const getAccount = makeGetAccount();
  const account = useSelector((state) => getAccount(state, id));

  return <Account account={account} hideActions showProfileHoverCard={false} />;

};

AutosuggestAccount.propTypes = {
  id: PropTypes.number.isRequired,
};

export default AutosuggestAccount;
