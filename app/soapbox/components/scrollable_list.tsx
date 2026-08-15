import 'react/jsx-dev-runtime';
import { Ruisseau } from '@bdxtown/ruisseau';
import React, { useRef, useCallback, useState, useImperativeHandle, useEffect, HTMLProps, ReactNode } from 'react';

import { Card, Text } from './ui';

interface IScrollableList extends Omit<HTMLProps<HTMLDivElement>, 'onSeeking'> {
  /** Unique key to preserve the scroll position when navigating back. */
  scrollKey?: string,
  /** Pagination callback when the end of the list is reached. */
  onLoadMore?: () => void,
  /** callback when user is a start */
  onStart?: () => void,
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
  onStart,
  start,
  ...rest
}, ref) => {

  const root = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => root.current);

  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    if (firstRender && isLoading) {
      root.current?.scrollTo(0, 0);
    }
    if (firstRender && !isLoading) {
      setFirstRender(false);
    }
  }, [isLoading, firstRender]);


  const onEnd = useCallback(() => {
    if (isLoading || !hasMore) return;
    onLoadMore();
  }, [onLoadMore, hasMore, isLoading]);

  const [scrollableParent, setScrollableParent] = useState<HTMLElement | undefined>(undefined);
  const findScrollableParent = useCallback((e: HTMLElement) => {
    root.current = e;
    const el = findNearestScrollableAncestor(e?.parentElement);
    setScrollableParent(el || e);
  }, []);

  return (
    <Ruisseau ref={findScrollableParent} {...rest} onStart={onStart} onSeeking={onSeeking} start={start} endRatio={0.7} name={scrollKey} className={`grow ${className}`} onEnd={onEnd} scrollElement={scrollableParent}>
      {prepend}
      {children}
      {React.Children.count(children) === 0 && !isLoading && (
        <div className='mt-2'>
          <Card variant='rounded' size='lg'>
            <Text>{emptyMessage}</Text>
          </Card>
        </div>
      )}
      {
        isLoading && Placeholder && Array(Math.max(1, firstRender ? placeholderCount : 1)).fill('').map(() => <Placeholder />)
      }
    </Ruisseau>
  );
});

export default ScrollableList;
export type { IScrollableList };