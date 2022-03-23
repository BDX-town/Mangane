import * as React from 'react';

export const useOnScreen = (ref: React.MutableRefObject<HTMLElement>) =>  {
  const [isIntersecting, setIntersecting] = React.useState(false);

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
  );

  React.useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
};
