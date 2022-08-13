import { useRef } from 'react';

/** Hook that allows using useState values in event handlers. */
// https://stackoverflow.com/a/64770671/8811886
export const useRefEventHandler = (fn: (...params: any) => void) => {
  const ref = useRef(fn);
  ref.current = fn;
  return ref;
};
