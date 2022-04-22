import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import PullToRefresh from 'soapbox/components/pull-to-refresh';
// import { useSettings } from 'soapbox/hooks';

import { Spinner, Text } from './ui';

const List = React.forwardRef((props: any, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { context, ...rest } = props;
  return <div ref={ref} className={context.listClassName} {...rest} />;
});

interface IScrollableList {
  scrollKey?: string,
  onLoadMore?: () => void,
  isLoading?: boolean,
  showLoading?: boolean,
  hasMore?: boolean,
  prepend?: React.ReactElement,
  alwaysPrepend?: boolean,
  emptyMessage?: React.ReactNode,
  children: Iterable<React.ReactNode>,
  onScrollToTop?: () => void,
  onScroll?: () => void,
  placeholderComponent?: React.ComponentType,
  placeholderCount?: number,
  onRefresh?: () => Promise<any>,
  className?: string,
}

const ScrollableList: React.FC<IScrollableList> = ({
  prepend = null,
  children,
  isLoading,
  emptyMessage,
  showLoading,
  onRefresh,
  onScroll,
  onScrollToTop,
  onLoadMore,
  className,
  placeholderComponent: Placeholder,
  placeholderCount = 0,
}) => {
  // const settings = useSettings();
  // const autoload = settings.get('autoloadMore');

  const showPlaceholder = showLoading && Placeholder && placeholderCount > 0;

  const renderItem = (_i: number, element: JSX.Element) => {
    if (showPlaceholder) {
      return <Placeholder />;
    } else {
      return element;
    }
  };

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <Virtuoso
        useWindowScroll
        className={className}
        data={showPlaceholder ? Array(placeholderCount).fill('') : Array.from(children || [])}
        startReached={onScrollToTop}
        endReached={onLoadMore}
        isScrolling={isScrolling => isScrolling && onScroll && onScroll()}
        itemContent={renderItem}
        context={{
          listClassName: className,
        }}
        components={{
          Header: () => prepend,
          ScrollSeekPlaceholder: Placeholder as any,
          EmptyPlaceholder: () => isLoading ? (
            <Spinner />
          ) : (
            <Text>{emptyMessage}</Text>
          ),
          List,
        }}
      />
    </PullToRefresh>
  );
};

export default ScrollableList;
