import React, { useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { getAcctFormURL } from 'soapbox/utils/accounts';


export default function AuthorizeInteraction() {
  const acct = useRef(getAcctFormURL(new URLSearchParams(window.location.search).get('uri')));

  return (
    <Redirect
      to={
        !acct.current ? '/404'
          : `/${acct.current}`
      }
    />
  );
}