import { Location } from 'history';
import { useEffect } from 'react';

const LOCAL_STORAGE_REDIRECT_KEY = 'soapbox:redirect-uri';

const cacheCurrentUrl = (location: Location<unknown>) => {
  const actualUrl = encodeURIComponent(`${location.pathname}${location.search}`);
  localStorage.setItem(LOCAL_STORAGE_REDIRECT_KEY, actualUrl);
  return actualUrl;
};

const getRedirectUrl = () => {
  let redirectUri = localStorage.getItem(LOCAL_STORAGE_REDIRECT_KEY);
  if (redirectUri) {
    redirectUri = decodeURIComponent(redirectUri);
  }

  localStorage.removeItem(LOCAL_STORAGE_REDIRECT_KEY);
  return redirectUri || '/';
};

const useCachedLocationHandler = () => {
  const removeCachedRedirectUri = () => localStorage.removeItem(LOCAL_STORAGE_REDIRECT_KEY);

  useEffect(() => {
    window.addEventListener('beforeunload', removeCachedRedirectUri);

    return () => {
      window.removeEventListener('beforeunload', removeCachedRedirectUri);
    };
  }, []);

  return null;
};

export { cacheCurrentUrl, getRedirectUrl, useCachedLocationHandler };
