import React, { useState, useEffect, useCallback } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { externalLogin, loginWithCode } from 'soapbox/actions/external_auth';
import snackbar from 'soapbox/actions/snackbar';
import { fetchServers, fetchPopularAccounts, validateServerSoftware } from 'soapbox/api/fedidb';
import { Button, Form, FormActions, Spinner, Text } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

import InstanceAutocomplete from './instance-autocomplete';
import PopularInstances from './popular-instances';
import RecommendedAccounts from './recommended-accounts';

import type { AxiosError } from 'axios';
import type { FediDBPopularAccount, FediDBServer } from 'soapbox/api/fedidb';

const messages = defineMessages({
  instanceFailed: { id: 'login_external.errors.instance_fail', defaultMessage: 'The instance returned an error.' },
  networkFailed: { id: 'login_external.errors.network_fail', defaultMessage: 'Connection failed. Is a browser extension blocking it?' },
  unsupportedSoftware: { id: 'login_external.errors.unsupported_software', defaultMessage: '{domain} runs {software}, which is not supported. Mangane supports Mastodon, Pleroma, Akkoma, Pixelfed, GoToSocial, and Mitra.' },
  title: { id: 'login_external.title', defaultMessage: 'Log in to the Fediverse' },
  subtitle: { id: 'login_external.subtitle', defaultMessage: 'Enter your instance to continue. We support Mastodon, Pleroma, Akkoma, Pixelfed, and more.' },
  continueWith: { id: 'login_external.continue_with', defaultMessage: 'Continue with {instance}' },
  continueButton: { id: 'login_external.continue', defaultMessage: 'Continue' },
});

/** Form for logging into a remote instance (phanpy-style with autocomplete) */
const ExternalLoginForm: React.FC = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [host, setHost] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [servers, setServers] = useState<FediDBServer[]>([]);
  const [popularAccounts, setPopularAccounts] = useState<FediDBPopularAccount[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [softwareWarning, setSoftwareWarning] = useState<string | null>(null);

  // Fetch servers and popular accounts from FediDB on mount
  useEffect(() => {
    let mounted = true;

    const loadData = async() => {
      setIsLoadingServers(true);
      const [serversData, accountsData] = await Promise.all([
        fetchServers(40),
        fetchPopularAccounts(),
      ]);

      if (mounted) {
        setServers(serversData);
        setPopularAccounts(accountsData);
        setIsLoadingServers(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = useCallback((instanceURL?: string, skipValidation = false) => {
    const hostToUse = instanceURL || host;
    if (!hostToUse) return;

    // Clean the host
    const cleanedHost = hostToUse
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .replace(/^@?[^@]+@/, '')
      .trim()
      .toLowerCase();

    if (!cleanedHost) return;

    setSoftwareWarning(null);
    setLoading(true);

    // Check if the domain is already in our pre-filtered server list (known supported)
    const isKnownSupported = servers.some(s => s.domain === cleanedHost);

    const proceed = () => {
      dispatch(externalLogin(cleanedHost))
        .then(() => setLoading(false))
        .catch((error: AxiosError) => {
          console.error(error);
          const status = error.response?.status;

          if (status) {
            dispatch(snackbar.error(intl.formatMessage(messages.instanceFailed)));
          } else if (!status && error.code === 'ERR_NETWORK') {
            dispatch(snackbar.error(intl.formatMessage(messages.networkFailed)));
          }

          setLoading(false);
        });
    };

    if (isKnownSupported || skipValidation) {
      proceed();
    } else {
      // Validate against FediDB before proceeding
      validateServerSoftware(cleanedHost).then(result => {
        if (result.supported) {
          proceed();
        } else {
          // Unsupported software detected
          setSoftwareWarning(
            intl.formatMessage(messages.unsupportedSoftware, {
              domain: cleanedHost,
              software: result.softwareName || 'unknown software',
            }),
          );
          setLoading(false);
        }
      }).catch(() => {
        // If validation fails, proceed anyway (benefit of the doubt)
        proceed();
      });
    }
  }, [host, dispatch, intl, servers]);

  const handleHostChange = useCallback((value: string) => {
    setHost(value);
    setSoftwareWarning(null);
  }, []);

  const handleFormSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSubmit();
  }, [handleSubmit]);

  const handleInstanceSelect = useCallback((domain: string) => {
    setHost(domain);
    setSoftwareWarning(null);
    handleSubmit(domain);
  }, [handleSubmit]);

  useEffect(() => {
    if (code) {
      dispatch(loginWithCode(code));
    }
  }, [code, dispatch]);

  if (code) {
    return <Spinner />;
  }

  // Determine the selected instance for button label
  const cleanedHost = host
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .replace(/^@?[^@]+@/, '')
    .trim()
    .toLowerCase();

  const hasValidHost = cleanedHost.length > 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center pb-4 border-b border-gray-200 dark:border-gray-600 -mx-4 sm:-mx-10 px-4 sm:px-10'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          {intl.formatMessage(messages.title)}
        </h1>
        <Text size='sm' theme='muted' className='mt-2'>
          {intl.formatMessage(messages.subtitle)}
        </Text>
      </div>

      {/* Login Form */}
      <Form onSubmit={handleFormSubmit} data-testid='external-login'>
        <div className='space-y-4'>
          <InstanceAutocomplete
            value={host}
            onChange={handleHostChange}
            onSubmit={handleInstanceSelect}
            servers={servers}
            isLoading={isLoading}
            isLoadingServers={isLoadingServers}
          />

          {/* Unsupported software warning */}
          {softwareWarning && (
            <div className='rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3'>
              <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                {softwareWarning}
              </p>
            </div>
          )}

          <FormActions>
            <Button
              theme='primary'
              type='submit'
              disabled={isLoading || !hasValidHost}
              block
            >
              {isLoading && (
                <Spinner withText={false} />
              )}
              {!isLoading && hasValidHost && intl.formatMessage(messages.continueWith, { instance: cleanedHost })}
              {!isLoading && !hasValidHost && intl.formatMessage(messages.continueButton)}
            </Button>
          </FormActions>
        </div>
      </Form>

      {/* Popular Instances (shown when input is empty) */}
      {!cleanedHost && (
        <PopularInstances
          servers={servers}
          onSelect={handleInstanceSelect}
        />
      )}

      {/* Recommended Accounts */}
      {!cleanedHost && popularAccounts.length > 0 && (
        <RecommendedAccounts
          accounts={popularAccounts}
          limit={6}
        />
      )}
    </div>
  );
};

export default ExternalLoginForm;
