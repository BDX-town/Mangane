import { Ref, useEffect, useMemo, useState } from 'react';

type UseDimensionsRect = { width: number, height: number };
type UseDimensionsResult = [Ref<HTMLDivElement>, any]

const defaultState: UseDimensionsRect = {
  width: 0,
  height: 0,
};

const useDimensions = (): UseDimensionsResult => {
  const [element, ref] = useState<Element | null>(null);
  const [rect, setRect] = useState<UseDimensionsRect>(defaultState);

  const observer = useMemo(
    () =>
      new (window as any).ResizeObserver((entries: any) => {
        if (entries[0]) {
          const { width, height } = entries[0].contentRect;
          setRect({ width, height });
        }
      }),
    [],
  );

  useEffect((): any => {
    if (!element) return null;
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, rect];
};

export { useDimensions };
