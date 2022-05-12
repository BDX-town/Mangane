import { useState, useEffect } from 'react';

type SystemTheme = 'light' | 'dark';

/** Get the system color scheme of the system. */
export const useSystemTheme = (): SystemTheme => {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const [dark, setDark] = useState(query.matches);

  const handleChange = (event: MediaQueryListEvent) => {
    setDark(event.matches);
  };

  useEffect(() => {
    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, []);

  return dark ? 'dark' : 'light';
};
