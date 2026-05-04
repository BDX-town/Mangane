import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useMemo, useCallback, useImperativeHandle, useState, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Virtuoso, Components, VirtuosoProps, VirtuosoHandle, ListRange, IndexLocationWithAlign } from 'react-virtuoso';

import { useDimensions, useSettings } from 'soapbox/hooks';

import LoadMore from './load_more';
import { Card, Spinner, Text } from './ui';
import classNames from 'classnames';

interface IScrollableList {
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
  /** Extra class names on the Virtuoso element. */
  className?: string,
  /** Class names on each item container. */
  itemClassName?: string,
  /** `id` attribute on the Virtuoso element. */
  id?: string,
  /** CSS styles on the Virtuoso element. */
  style?: React.CSSProperties,
}

function findClosestScrollableAncestor(el: HTMLElement) {
  if (!el) return undefined
  if (el.scrollHeight > el.clientHeight) return el
  return findClosestScrollableAncestor(el.parentElement)
}

interface IScrollRestorer {
  scrollDataKey: string;
  scrollData: number | null;
  root: HTMLDivElement | null;
  onReady: () => void;
}

// we are storing scroll data here so it resets on each reload 
const SCROLL_DATA = {}

const ScrollableList = React.forwardRef(({ scrollKey, id, className, style, children, hasMore, onLoadMore, isLoading, placeholderComponent: Placeholder, placeholderCount = 0, showLoading, ...rest }: IScrollableList, ref) => {

  const footer = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)

  const [scrollableAncestor, setScrollableAncestor] = useState<HTMLElement>(null)
  const scrollDataKey = useMemo(() => scrollKey ? `soapbox:scrollData:${scrollKey}` : undefined, [scrollKey]);
  const [start, setStart] = useState(SCROLL_DATA[scrollDataKey] ? SCROLL_DATA[scrollDataKey][0] : 0)
  const [end, setEnd] = useState(SCROLL_DATA[scrollDataKey] ? SCROLL_DATA[scrollDataKey][1] : 0)

  useImperativeHandle(ref, () => root.current)

  const settings = useSettings();
  const autoloadMore = settings.get('autoloadMore');

  const onInternalLoadMore = useCallback(() => {
    if (onLoadMore) onLoadMore()
  }, [onLoadMore])

  const actualChildren = useMemo(() => {
    const childs = React.Children.toArray(children)
    return childs.slice(start, childs.length - end)
  }, [children, start, end])

  // handle autoload more
  useEffect(() => {
    if (!footer.current || !autoloadMore || !hasMore || !onLoadMore || isLoading || actualChildren.length === 0) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onInternalLoadMore()
      })
    })
    observer.observe(footer.current)
    return () => observer.disconnect()
  }, [onInternalLoadMore, autoloadMore, hasMore, onLoadMore, isLoading, actualChildren])

  const startRef = useRef(start)

  const popStart = useCallback((e: HTMLElement) => {
    console.log("popStart", e)
    startRef.current += 1
    setStart(startRef.current)
  }, [])

  const pushStart = useCallback(() => {
    console.log("pushStart")
    startRef.current = Math.max(0, startRef.current - 1)
    setStart(startRef.current)
  }, [])

  const endRef = useRef(end)

  const popEnd = useCallback((e: HTMLElement) => {
    // console.log("popEnd", e)
    endRef.current += 1
    setEnd(endRef.current)
  }, [])

  const pushEnd = useCallback(() => {
    // console.log("pushEnd")
    endRef.current = Math.max(0, endRef.current - 1)
    setEnd(endRef.current)
  }, [])


  // managing closest scrollable ancestor 
  useLayoutEffect(() => { // this needs to be called before layout changes 
    if (!root.current) return undefined
    let ancestor;
    const callback = () => {
      ancestor = findClosestScrollableAncestor(root.current)
      console.log("ANCESTOR", ancestor)
      if (ancestor) {
        observer.disconnect() // we prevent calling of all this again if we have an ancestor 
        ancestor.classList.add("[scrollbar-width:none]", "[&::-webkit-scrollbar]:hidden")
        if (SCROLL_DATA[scrollDataKey]) {
          console.log("RESTORING", scrollDataKey, SCROLL_DATA[scrollDataKey])
          ancestor.scrollTop = SCROLL_DATA[scrollDataKey][2]
        }
      }
      setScrollableAncestor(ancestor)
    }
    const observer = new MutationObserver(callback);
    observer.observe(root.current, { childList: true });
    callback()
    return () => {
      observer.disconnect()
      ancestor.classList.remove("[scrollbar-width:none]", "[&::-webkit-scrollbar]:hidden")
      if (scrollDataKey) {
        SCROLL_DATA[scrollDataKey] = [startRef.current, endRef.current, ancestor.scrollTop]
        console.log("SAVING", scrollDataKey, SCROLL_DATA[scrollDataKey])
      }
    }
  }, [scrollDataKey])

  // watching for elements leaving and entering "screen" (screen height*2 up and down) 
  // top and bottom sentries are used to push elements back
  useEffect(() => {
    if (!root.current || !scrollableAncestor) return undefined;
    const scrollableViewport = scrollableAncestor.getBoundingClientRect()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === footer.current) return
        if (e.target === top.current) {
          if (e.isIntersecting) { // the top sentry is back into root 
            pushStart()
          }
          return;
        }
        if (e.target === bottom.current) {
          if (e.isIntersecting) { // the bottom sentry is back into root 
            pushEnd()
          }
          return;
        }
        if (!e.isIntersecting && e.boundingClientRect.bottom <= 0) popStart(e.target)
        if (!e.isIntersecting && e.boundingClientRect.bottom > 0) popEnd(e.target)
      })
    }, { root: scrollableAncestor, rootMargin: `${scrollableViewport.height}px 0px ${scrollableViewport.height}px 0px` })
    root.current.childNodes.forEach((n: Element) => {
      observer.observe(n)
    })
    return () => observer.disconnect()
  }, [scrollableAncestor, actualChildren, popStart, pushStart, popEnd, pushEnd])

  return (
    <div
      ref={root}
      id={id}
      className={className}
      style={style}
    >
      <div ref={top} />
      {actualChildren}
      <div className='pb-3' ref={footer}>
        {
          !autoloadMore && hasMore && onLoadMore && <LoadMore visible={!isLoading} onClick={onInternalLoadMore} />
        }
        {
          isLoading && (
            <div className='flex flex-col gap-3'>
              {(Placeholder && (placeholderCount > 0)) ? new Array(placeholderCount).fill(undefined).map((_, index) => <Placeholder key={index} />) : <Spinner />}
            </div>
          )
        }
      </div>
      <div ref={bottom} />
    </div>
  )
})

export default ScrollableList;


// /** Custom Viruoso component context. */
// type Context = {
//   itemClassName?: string,
//   listClassName?: string,
// }

// /** Scroll position saved in sessionStorage. */
// type SavedScrollPosition = {
//   index: number,
//   offset: number,
// }

// /** Custom Virtuoso Item component representing a single scrollable item. */
// // NOTE: It's crucial to space lists with **padding** instead of margin!
// // Pass an `itemClassName` like `pb-3`, NOT a `space-y-3` className
// // https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
// const Item: Components<Context>['Item'] = ({ context, ...rest }) => (
//   <div className={context?.itemClassName} {...rest} />
// );

// /** Custom Virtuoso List component for the outer container. */
// // Ensure the className winds up here
// const List: Components<Context>['List'] = React.forwardRef((props, ref) => {
//   const { context, ...rest } = props;
//   return <div ref={ref} className={context?.listClassName} {...rest} />;
// });

// interface IScrollableList extends VirtuosoProps<any, any> {
//   /** Unique key to preserve the scroll position when navigating back. */
//   scrollKey?: string,
//   /** Pagination callback when the end of the list is reached. */
//   onLoadMore?: () => void,
//   /** Whether the data is currently being fetched. */
//   isLoading?: boolean,
//   /** Whether to actually display the loading state. */
//   showLoading?: boolean,
//   /** Whether we expect an additional page of data. */
//   hasMore?: boolean,
//   /** Additional element to display at the top of the list. */
//   prepend?: React.ReactNode,
//   /** Whether to display the prepended element. */
//   alwaysPrepend?: boolean,
//   /** Message to display when the list is loaded but empty. */
//   emptyMessage?: React.ReactNode,
//   /** Scrollable content. */
//   children: Iterable<React.ReactNode>,
//   /** Callback when the list is scrolled to the top. */
//   onScrollToTop?: () => void,
//   /** Callback when the list is scrolled. */
//   onScroll?: () => void,
//   /** Placeholder component to render while loading. */
//   placeholderComponent?: React.ComponentType | React.NamedExoticComponent,
//   /** Number of placeholders to render while loading. */
//   placeholderCount?: number,
//   /**
//    * Pull to refresh callback.
//    * @deprecated Put a PTR around the component instead.
//    */
//   onRefresh?: () => Promise<any>,
//   /** Extra class names on the Virtuoso element. */
//   className?: string,
//   /** Class names on each item container. */
//   itemClassName?: string,
//   /** `id` attribute on the Virtuoso element. */
//   id?: string,
//   /** CSS styles on the Virtuoso element. */
//   style?: React.CSSProperties,
//   /** Whether to use the window to scroll the content instead of Virtuoso's container. */
//   useWindowScroll?: boolean
// }

// /** Legacy ScrollableList with Virtuoso for backwards-compatibility. */
// const ScrollableList = React.forwardRef<VirtuosoHandle, IScrollableList>(({
//   scrollKey,
//   prepend = null,
//   alwaysPrepend,
//   children,
//   isLoading,
//   emptyMessage,
//   showLoading,
//   onRefresh,
//   onScroll,
//   onScrollToTop,
//   onLoadMore,
//   className,
//   itemClassName,
//   id,
//   hasMore,
//   placeholderComponent: Placeholder,
//   placeholderCount = 0,
//   initialTopMostItemIndex = 0,
//   style = {},
//   useWindowScroll = true,
// }, ref) => {
//   const history = useHistory();
//   const settings = useSettings();
//   const autoloadMore = settings.get('autoloadMore');

//   // Preserve scroll position
//   const scrollDataKey = useMemo(() => `soapbox:scrollData:${scrollKey}`, [scrollKey]);
//   const scrollData: SavedScrollPosition | null = useMemo(() => JSON.parse(sessionStorage.getItem(scrollDataKey)!), [scrollDataKey]);
//   const topIndex = useRef<number>(scrollData ? scrollData.index : 0);
//   const topOffset = useRef<number>(scrollData ? scrollData.offset : 0);

//   const showPlaceholder = useMemo(() => showLoading && Placeholder && placeholderCount > 0, [Placeholder, placeholderCount, showLoading]);

//   const data = useMemo(() => {
//     /** Normalized children. */
//     const elements = Array.from(children || []);
//     // NOTE: We are doing some trickery to load a feed of placeholders
//     // Virtuoso's `EmptyPlaceholder` unfortunately doesn't work for our use-case
//     const res = showPlaceholder ? Array(placeholderCount).fill('') : elements;
//     // Add a placeholder at the bottom for loading
//     // (Don't use Virtuoso's `Footer` component because it doesn't preserve its height)
//     if (hasMore && (autoloadMore || isLoading) && Placeholder) {
//       res.push(<Placeholder />);
//     } else if (hasMore && (autoloadMore || isLoading)) {
//       res.push(<Spinner />);
//     }
//     return res;
//   }, [Placeholder, autoloadMore, children, hasMore, isLoading, placeholderCount, showPlaceholder]);

//   // eslint-disable-next-line react-hooks/refs
//   const handleScrollDebounced = useMemo(() => debounce(() => {
//     // HACK: Virtuoso has no better way to get this...
//     const node = document.querySelector(`[data-virtuoso-scroller] [data-item-index="${topIndex.current}"]`);
//     if (node) {
//       topOffset.current = node.getBoundingClientRect().top * -1;
//     } else {
//       topOffset.current = 0;
//     }
//   }, 150, { trailing: true }), []);

//   const handleScroll = useCallback(() => handleScrollDebounced(), [handleScrollDebounced]);

//   useEffect(() => {
//     document.addEventListener('scroll', handleScroll);
//     sessionStorage.removeItem(scrollDataKey);

//     return () => {
//       if (scrollKey) {
//         const data: SavedScrollPosition = { index: topIndex.current, offset: topOffset.current };
//         sessionStorage.setItem(scrollDataKey, JSON.stringify(data));
//       }
//       document.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll, scrollDataKey, scrollKey]);

//   /* Render an empty state instead of the scrollable list. */
//   const renderEmpty = (): JSX.Element => {
//     return (
//       <div className='mt-2'>
//         {alwaysPrepend && prepend}

//         <Card variant='rounded' size='lg'>
//           {isLoading ? (
//             <Spinner />
//           ) : (
//             <Text>{emptyMessage}</Text>
//           )}
//         </Card>
//       </div>
//     );
//   };

//   /** Render a single item. */
//   const renderItem = (_i: number, element: JSX.Element): JSX.Element => {
//     if (showPlaceholder) {
//       return <Placeholder />;
//     } else {
//       return element;
//     }
//   };

//   const handleEndReached = useCallback(() => {
//     if (autoloadMore && hasMore && onLoadMore) {
//       onLoadMore();
//     }
//   }, [autoloadMore, hasMore, onLoadMore]);

//   const loadMore = () => {
//     if (autoloadMore || !hasMore || !onLoadMore) {
//       return null;
//     } else {
//       return <LoadMore visible={!isLoading} onClick={onLoadMore} />;
//     }
//   };

//   const handleRangeChange = useCallback((range: ListRange) => {
//     // HACK: using the first index can be buggy.
//     // Track the second item instead, unless the endIndex comes before it (eg one 1 item in view).
//     topIndex.current = Math.min(range.startIndex + 1, range.endIndex);
//     handleScroll();
//   }, [handleScroll]);

//   /** Figure out the initial index to scroll to. */
//   const initialIndex = useMemo<number | IndexLocationWithAlign>(() => {
//     if (showLoading) return 0;
//     if (initialTopMostItemIndex) return initialTopMostItemIndex;

//     if (scrollData && history.action === 'POP') {
//       return {
//         align: 'start',
//         index: scrollData.index,
//         offset: scrollData.offset,
//       };
//     }

//     return 0;
//   }, [showLoading, initialTopMostItemIndex, scrollData, history.action]);

//   return (
//     <Virtuoso
//       ref={ref}
//       id={id}
//       useWindowScroll={useWindowScroll}
//       className={className}
//       data={data}
//       startReached={onScrollToTop}
//       endReached={handleEndReached}
//       isScrolling={isScrolling => isScrolling && onScroll && onScroll()}
//       itemContent={renderItem}
//       initialTopMostItemIndex={initialIndex}
//       rangeChanged={handleRangeChange}
//       style={style}
//       context={{
//         listClassName: className,
//         itemClassName,
//       }}
//       components={{
//         Header: () => <>{prepend}</>,
//         ScrollSeekPlaceholder: Placeholder as any,
//         EmptyPlaceholder: () => renderEmpty(),
//         List,
//         Item,
//         Footer: loadMore,
//       }}
//     />
//   );
// });

// export default ScrollableList;
// export type { IScrollableList };
