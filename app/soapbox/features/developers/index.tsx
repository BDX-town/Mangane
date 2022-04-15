import React from 'react';

import { getSettings } from 'soapbox/actions/settings';
import { useAppSelector } from 'soapbox/hooks';

import DevelopersChallenge from './developers_challenge';
import DevelopersMenu from './developers_menu';

const Developers: React.FC = () => {
  const isDeveloper = useAppSelector((state) => getSettings(state).get('isDeveloper'));

  return isDeveloper ? <DevelopersMenu /> : <DevelopersChallenge />;
};

export default Developers;
