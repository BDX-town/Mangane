import { debounce } from 'lodash';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Virtuoso, Components, VirtuosoProps, VirtuosoHandle, ListRange, IndexLocationWithAlign } from 'react-virtuoso';

import PullToRefresh from 'soapbox/components/pull-to-refresh';
import { useSettings } from 'soapbox/hooks';

import LoadMore from './load_more';
import { Spinner, Text } from './ui';

type Context = {
  itemClassName?: string,
  listClassName?: string,
}

/** Scroll position saved in sessionStorage. */
type SavedScrollPosition = {
  index: number,
  offset: number,
}

// NOTE: It's crucial to space lists with **padding** instead of margin!
// Pass an `itemClassName` like `pb-3`, NOT a `space-y-3` className
// https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
const Item: Components<Context>['Item'] = ({ context, ...rest }) => (
  <div className={context?.itemClassName} {...rest} />
);

// Ensure the className winds up here
const List: Components<Context>['List'] = React.forwardRef((props, ref) => {
  const { context, ...rest } = props;
  return <div ref={ref} className={context?.listClassName} {...rest} />;
});

interface IScrollableList extends VirtuosoProps<any, any> {
  scrollKey?: string,
  onLoadMore?: () => void,
  isLoading?: boolean,
  showLoading?: boolean,
  hasMore?: boolean,
  prepend?: React.ReactNode,
  alwaysPrepend?: boolean,
  emptyMessage?: React.ReactNode,
  children: Iterable<React.ReactNode>,
  onScrollToTop?: () => void,
  onScroll?: () => void,
  placeholderComponent?: React.ComponentType | React.NamedExoticComponent,
  placeholderCount?: number,
  onRefresh?: () => Promise<any>,
  className?: string,
  itemClassName?: string,
  id?: string,
  style?: React.CSSProperties,
  useWindowScroll?: boolean
}

/** Legacy ScrollableList with Virtuoso for backwards-compatibility */
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

  // Preserve scroll position
  const scrollDataKey = `soapbox:scrollData:${scrollKey}`;
  const scrollData: SavedScrollPosition | null = useMemo(() => JSON.parse(sessionStorage.getItem(scrollDataKey)!), []);
  const topIndex = useRef<number>(scrollData ? scrollData.index : 0);
  const topOffset = useRef<number>(scrollData ? scrollData.offset : 0);

  /** Normalized children */
  const elements = Array.from(children || []);

  const showPlaceholder = showLoading && Placeholder && placeholderCount > 0;

  // NOTE: We are doing some trickery to load a feed of placeholders
  // Virtuoso's `EmptyPlaceholder` unfortunately doesn't work for our use-case
  const data = showPlaceholder ? Array(placeholderCount).fill('') : elements;
  const isEmpty = data.length === 0; // Yes, if it has placeholders it isn't "empty"

  // Add a placeholder at the bottom for loading
  // (Don't use Virtuoso's `Footer` component because it doesn't preserve its height)
  if (hasMore && (autoloadMore || isLoading) && Placeholder) {
    data.push(<Placeholder />);
  } else if (hasMore && (autoloadMore || isLoading)) {
    data.push(<Spinner />);
  }

  const handleScroll = useCallback(debounce(() => {
    // HACK: Virtuoso has no better way to get this...
    const node = document.querySelector(`[data-virtuoso-scroller] [data-item-index="${topIndex.current}"]`);
    if (node) {
      topOffset.current = node.getBoundingClientRect().top * -1;
    } else {
      topOffset.current = 0;
    }
  }, 150, { trailing: true }), []);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    sessionStorage.removeItem(scrollDataKey);

    return () => {
      if (scrollKey) {
        const data: SavedScrollPosition = { index: topIndex.current, offset: topOffset.current };
        sessionStorage.setItem(scrollDataKey, JSON.stringify(data));
      }
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* Render an empty state instead of the scrollable list */
  const renderEmpty = (): JSX.Element => {
    return (
      <div className='mt-2'>
        {alwaysPrepend && prepend}

        <div className='bg-primary-50 dark:bg-slate-700 mt-2 rounded-lg text-center p-8'>
          {isLoading ? (
            <Spinner />
          ) : (
            <Text>{emptyMessage}</Text>
          )}
        </div>
      </div>
    );
  };

  /** Render a single item */
  const renderItem = (_i: number, element: JSX.Element): JSX.Element => {
    if (showPlaceholder) {
      return <Placeholder />;
    } else {
      return element;
    }
  };

  const handleEndReached = () => {
    if (autoloadMore && hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  const loadMore = () => {
    if (autoloadMore || !hasMore || !onLoadMore) {
      return null;
    } else {
      return <LoadMore visible={!isLoading} onClick={onLoadMore} />;
    }
  };

  const handleRangeChange = (range: ListRange) => {
    topIndex.current = range.startIndex;
    handleScroll();
  };

  /** Figure out the initial index to scroll to. */
  const initialIndex = useMemo<number | IndexLocationWithAlign>(() => {
    if (showLoading) return 0;
    if (initialTopMostItemIndex) return initialTopMostItemIndex;

    if (scrollData && history.action === 'POP') {
      return {
        align: 'start',
        index: scrollData.index,
        offset: scrollData.offset,
      };
    }

    return 0;
  }, [showLoading, initialTopMostItemIndex]);

  /** Render the actual Virtuoso list */
  const renderFeed = (): JSX.Element => (
    <Virtuoso
      ref={ref}
      id={id}
      useWindowScroll={useWindowScroll}
      className={className}
      data={data}
      startReached={onScrollToTop}
      endReached={handleEndReached}
      isScrolling={isScrolling => isScrolling && onScroll && onScroll()}
      itemContent={renderItem}
      initialTopMostItemIndex={initialIndex}
      rangeChanged={handleRangeChange}
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
  );

  /** Conditionally render inner elements */
  const renderBody = (): JSX.Element => {
    if (isEmpty) {
      return renderEmpty();
    } else {
      return renderFeed();
    }
  };

  return (
    <PullToRefresh onRefresh={onRefresh}>
      {renderBody()}
    </PullToRefresh>
  );
});

export default ScrollableList;
export type { IScrollableList };
