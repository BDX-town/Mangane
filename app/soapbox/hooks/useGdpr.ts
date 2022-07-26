import { useEffect, useRef } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';

import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useSoapboxConfig } from './useSoapboxConfig';

const hasGdpr = !!localStorage.getItem('soapbox:gdpr');

const messages = defineMessages({
  accept: { id: 'gdpr.accept', defaultMessage: 'Accept' },
  learnMore: { id: 'gdpr.learn_more', defaultMessage: 'Learn more' },
  body: { id: 'gdpr.message', defaultMessage: '{siteTitle} uses session cookies, which are essential to the website\'s functioning.' },
});

/** Displays a GDPR popup unless it has already been accepted. */
const useGdpr = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  /** Track whether the snackbar has already been displayed once. */
  const triggered = useRef<boolean>(hasGdpr);

  const soapbox = useSoapboxConfig();
  const isLoggedIn = useAppSelector(state => !!state.me);
  const siteTitle = useAppSelector(state => state.instance.title);

  const handleAccept = () => {
    localStorage.setItem('soapbox:gdpr', 'true');
    triggered.current = true;
  };

  useEffect(() => {
    if (soapbox.gdpr && !isLoggedIn && !triggered.current) {
      const message = intl.formatMessage(messages.body, { siteTitle });

      dispatch(snackbar.show('info', message, {
        action: handleAccept,
        actionLabel: intl.formatMessage(messages.accept),
        dismissAfter: false,
      }));
    }
  }, [soapbox.gdpr, isLoggedIn]);
};

export { useGdpr };
