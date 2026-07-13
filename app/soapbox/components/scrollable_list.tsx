import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useMemo, useCallback, useState, MouseEventHandler, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Virtuoso, Components, VirtuosoProps, VirtuosoHandle, ListRange, IndexLocationWithAlign, ListItem } from 'react-virtuoso';

import { useSettings } from 'soapbox/hooks';

import LoadMore from './load_more';
import { Card, Spinner, Text } from './ui';

/** Custom Viruoso component context. */
type Context = {
  itemClassName?: string,
  listClassName?: string,
}

/** Scroll position saved in sessionStorage. */
type SavedScrollPosition = {
  index: number,
  offset: number,
}

/** Custom Virtuoso Item component representing a single scrollable item. */
// NOTE: It's crucial to space lists with **padding** instead of margin!
// Pass an `itemClassName` like `pb-3`, NOT a `space-y-3` className
// https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
const Item: Components<Context>['Item'] = ({ context, ...rest }) => (
  <div className={context?.itemClassName} {...rest} />
);

/** Custom Virtuoso List component for the outer container. */
// Ensure the className winds up here
const List: Components<Context>['List'] = React.forwardRef((props, ref) => {
  const { context, ...rest } = props;
  return <div ref={ref} className={context?.listClassName} {...rest} />;
});

interface IScrollableList extends VirtuosoProps<any, any> {
  /** Unique key to preserve the scroll position when navigating back. */
  scrollKey?: string,
  /** Pagination callback when the end of the list is reached. */
  onLoadMore?: () => void,
  /** Whether the data is currently being fetched. */
  isLoading?: boolean,
  /** Whether to actually display the loading state. */
  showLoading?: boolean,
  /** Whether we expect an additional page of data. */
  hasMore?: boolean,
  /** Additional element to display at the top of the list. */
  prepend?: React.ReactNode,
  /** Whether to display the prepended element. */
  alwaysPrepend?: boolean,
  /** Message to display when the list is loaded but empty. */
  emptyMessage?: React.ReactNode,
  /** Scrollable content. */
  children: Iterable<React.ReactNode>,
  /** Callback when the list is scrolled to the top. */
  onScrollToTop?: () => void,
  /** Callback when the list is scrolled. */
  onScroll?: () => void,
  /** Placeholder component to render while loading. */
  placeholderComponent?: React.ComponentType | React.NamedExoticComponent,
  /** Number of placeholders to render while loading. */
  placeholderCount?: number,
  /**
   * Pull to refresh callback.
   * @deprecated Put a PTR around the component instead.
   */
  onRefresh?: () => Promise<any>,
  /** Extra class names on the Virtuoso element. */
  className?: string,
  /** Class names on each item container. */
  itemClassName?: string,
  /** `id` attribute on the Virtuoso element. */
  id?: string,
  /** CSS styles on the Virtuoso element. */
  style?: React.CSSProperties,
  /** Whether to use the window to scroll the content instead of Virtuoso's container. */
  useWindowScroll?: boolean
}

function findNearestScrollableParent(el: HTMLElement): HTMLElement | undefined {
  while (el) {
    el = el.parentElement;
    if (!el) break;
    const { overflowY } = window.getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return el;
    }
  }
  return undefined
}

/** Legacy ScrollableList with Virtuoso for backwards-compatibility. */
const ScrollableList = React.forwardRef<VirtuosoHandle, IScrollableList>(({
  scrollKey,
  prepend = null,
  alwaysPrepend,
  children,
  isLoading,
  emptyMessage,
  showLoading,
  onRefresh,
  onScroll,
  onScrollToTop,
  onLoadMore,
  className,
  itemClassName,
  id,
  hasMore,
  placeholderComponent: Placeholder,
  placeholderCount = 0,
  initialTopMostItemIndex = 0,
  style = {},
  useWindowScroll = true,
}, ref) => {
  const history = useHistory();
  const settings = useSettings();
  const autoloadMore = settings.get('autoloadMore');

  const [scrollParent, setScrollParentInternal] = useState<HTMLElement | undefined>(undefined);

  const setScrollParent = useCallback((e: HTMLElement) => {
    setScrollParentInternal(findNearestScrollableParent(e));
  }, []);

  // Preserve scroll position
  const scrollDataKey = useMemo(() => scrollKey ? `soapbox:scrollData:${scrollKey}` : undefined, [scrollKey]);
  const scrollData: SavedScrollPosition | null = useMemo(() => JSON.parse(sessionStorage.getItem(scrollDataKey)!), [scrollDataKey]);
  const [ready, setReady] = useState(!scrollData);

  const showPlaceholder = useMemo(() => showLoading && Placeholder && placeholderCount > 0, [Placeholder, placeholderCount, showLoading]);



  const data = useMemo(() => {
    /** Normalized children. */
    const elements = Array.from(children || []);
    // NOTE: We are doing some trickery to load a feed of placeholders
    // Virtuoso's `EmptyPlaceholder` unfortunately doesn't work for our use-case
    const res = showPlaceholder ? Array(placeholderCount).fill('') : elements;
    // Add a placeholder at the bottom for loading
    // (Don't use Virtuoso's `Footer` component because it doesn't preserve its height)
    if (hasMore && (autoloadMore || isLoading) && Placeholder) {
      res.push(<Placeholder />);
    } else if (hasMore && (autoloadMore || isLoading)) {
      res.push(<Spinner />);
    }
    return res;
  }, [Placeholder, autoloadMore, children, hasMore, isLoading, placeholderCount, showPlaceholder]);



  /* Render an empty state instead of the scrollable list. */
  const renderEmpty = (): JSX.Element => {
    return (
      <div className='mt-2'>
        {alwaysPrepend && prepend}

        <Card variant='rounded' size='lg'>
          {isLoading ? (
            <Spinner />
          ) : (
            <Text>{emptyMessage}</Text>
          )}
        </Card>
      </div>
    );
  };

  /** Render a single item. */
  const renderItem = (_i: number, element: JSX.Element): JSX.Element => {
    if (showPlaceholder) {
      return <Placeholder />;
    } else {
      return element;
    }
  };

  const handleEndReached = useCallback(() => {
    if (autoloadMore && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [autoloadMore, hasMore, onLoadMore]);

  const loadMore = () => {
    if (autoloadMore || !hasMore || !onLoadMore) {
      return null;
    } else {
      return <LoadMore visible={!isLoading} onClick={onLoadMore} />;
    }
  };

  const firstVisibleItem = useRef<{index: number, offset: number} | undefined>(undefined)
  const stabilizedTimer = useRef(null);
  const handleItemsRendered = useCallback((items: ListItem<any>[]) => {
    if(items.length == 0) {
      firstVisibleItem.current = undefined
      return;
    };
    firstVisibleItem.current = ({ 
      index: items[0].index,
      offset: items[0].offset
    });
    if(!ready && scrollDataKey && scrollData) {
      clearTimeout(stabilizedTimer.current);
      stabilizedTimer.current = setTimeout(() => {
        const scrollTarget = scrollParent || document.documentElement
        scrollTarget.scrollBy(0, scrollData.offset);
        setReady(true)
      }, 200)
    }
  }, [ready, scrollParent, scrollData, scrollDataKey])

  useLayoutEffect(() => {
    return () => {
      clearTimeout(stabilizedTimer.current);
      if(!firstVisibleItem.current || !scrollDataKey) return;
      const scrollTarget = scrollParent || document.documentElement
      const data: SavedScrollPosition = { 
        ...firstVisibleItem.current,
        offset: scrollTarget.scrollTop - firstVisibleItem.current.offset
      };
      sessionStorage.setItem(scrollDataKey, JSON.stringify(data));
    }
  }, [scrollParent, scrollDataKey])

  /** Figure out the initial index to scroll to. */
  const initialIndex = useMemo<number | IndexLocationWithAlign>(() => {
    if (showLoading) return 0;
    if (initialTopMostItemIndex) return initialTopMostItemIndex;
    if (scrollData && history.action === 'POP') {
      return {
        align: 'start',
        index: scrollData.index,
        offset: 0,
      };
    }

    return 0;
  }, [showLoading, initialTopMostItemIndex, scrollData, history.action]);

  return (
    <div ref={setScrollParent}>
      <Virtuoso
        ref={ref}
        id={id}
        {...(scrollParent ? { customScrollParent: scrollParent } : { useWindowScroll })}
        className={`${className} transition-opacity ${ready ? 'opacity-100' : 'opacity-0'}`}
        data={data}
        startReached={onScrollToTop}
        endReached={handleEndReached}
        isScrolling={isScrolling => isScrolling && onScroll && onScroll()}
        itemContent={renderItem}
        initialTopMostItemIndex={initialIndex}
        itemsRendered={handleItemsRendered}
        style={style}
        context={{
          listClassName: className,
          itemClassName,
        }}
        components={{
          Header: () => <>{prepend}</>,
          ScrollSeekPlaceholder: Placeholder as any,
          EmptyPlaceholder: () => renderEmpty(),
          List,
          Item,
          Footer: loadMore,
        }}
      />
    </div>
  );
});

export default ScrollableList;
export type { IScrollableList };