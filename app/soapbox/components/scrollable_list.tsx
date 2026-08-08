import 'react/jsx-dev-runtime';
import { Ruisseau } from '@bdxtown/ruisseau';
import React, { useRef, useCallback, useState, useImperativeHandle, useEffect, HTMLProps, ReactNode } from 'react';


import { useSettings } from 'soapbox/hooks';

import LoadMore from './load_more';
import { Card, Text } from './ui';

interface IScrollableList extends Omit<HTMLProps<HTMLDivElement>, 'onSeeking'> {
  /** Unique key to preserve the scroll position when navigating back. */
  scrollKey?: string,
  /** Pagination callback when the end of the list is reached. */
  onLoadMore?: () => void,
  /** Whether the data is currently being fetched. */
  isLoading?: boolean,
  /** Whether we expect an additional page of data. */
  hasMore?: boolean,
  /** Message to display when the list is loaded but empty. */
  emptyMessage?: React.ReactNode,
  /** Scrollable content. */
  children: Iterable<React.ReactNode>,
  /** Placeholder component to render while loading. */
  placeholderComponent?: React.ComponentType | React.NamedExoticComponent,
  /** Number of placeholders to render while loading. */
  placeholderCount?: number,
  /** Extra class names on the Virtuoso element. */
  className?: string,
  prepend?: ReactNode,
  onSeeking?: (seeking: boolean) => void,
  start?: number,
}

function findNearestScrollableAncestor(el: HTMLElement) {
  if (!el) return undefined;
  const styles = getComputedStyle(el);
  if ((styles.overflowY === 'auto' || styles.overflowY === 'scroll')) return el;
  return findNearestScrollableAncestor(el.parentElement);
}

const ScrollableList = React.forwardRef<HTMLElement, IScrollableList>(({
  scrollKey,
  children,
  onSeeking,
  isLoading,
  emptyMessage,
  onLoadMore,
  className,
  hasMore,
  placeholderComponent: Placeholder,
  placeholderCount = 0,
  prepend,
  start,
  ...rest
}, ref) => {
  const settings = useSettings();
  const autoloadMore = settings.get('autoloadMore');

  const root = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => root.current);

  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    if (firstRender && isLoading) {
      root.current?.scrollTo(0, 0);
    }
    if (firstRender && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstRender(false);
    }
  }, [isLoading, firstRender]);


  const onEnd = useCallback(() => {
    if (isLoading || !autoloadMore || !hasMore) return;
    onLoadMore();
  }, [autoloadMore, hasMore, isLoading, onLoadMore]);

  const [scrollableParent, setScrollableParent] = useState<HTMLElement | undefined>(undefined);
  const findScrollableParent = useCallback((e: HTMLElement) => {
    root.current = e;
    const el = findNearestScrollableAncestor(e?.parentElement);
    setScrollableParent(el || e);
  }, []);

  return (
    <Ruisseau ref={findScrollableParent} {...rest} onSeeking={onSeeking} start={start} endRatio={0.7} name={scrollKey} className={`grow ${className}`} onEnd={onEnd} scrollElement={scrollableParent}>
      {prepend}
      {children}
      {React.Children.count(children) === 0 && !isLoading && emptyMessage && (
        <div className='mt-2'>
          <Card variant='rounded' size='lg'>
            <Text>{emptyMessage}</Text>
          </Card>
        </div>
      )}
      {
        isLoading && Placeholder && Array(Math.max(1, firstRender ? placeholderCount : 1)).fill('').map(() => <Placeholder />)
      }
      {
        !autoloadMore && hasMore && <LoadMore disabled={isLoading} onClick={onLoadMore} />
      }
    </Ruisseau>
  );
});

export default ScrollableList;
export type { IScrollableList };