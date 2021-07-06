import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IntersectionObserverArticleContainer from '../containers/intersection_observer_article_container';
import LoadMore from './load_more';
import MoreFollows from './more_follows';
import IntersectionObserverWrapper from '../features/ui/util/intersection_observer_wrapper';
import { throttle } from 'lodash';
import { List as ImmutableList } from 'immutable';
import LoadingIndicator from './loading_indicator';

const MOUSE_IDLE_DELAY = 300;

export default class ScrollableList extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    showLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    diffCount: PropTypes.number,
    prepend: PropTypes.node,
    alwaysPrepend: PropTypes.bool,
    emptyMessage: PropTypes.node,
    children: PropTypes.node,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
  };

  state = {
    cachedMediaWidth: 250, // Default media/card width using default theme
  };

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  mouseIdleTimer = null;
  mouseMovedRecently = false;
  lastScrollWasSynthetic = false;
  scrollToTopOnMouseIdle = false;

  setScrollTop = newScrollTop => {
    if (this.documentElement.scrollTop !== newScrollTop) {
      this.lastScrollWasSynthetic = true;
      this.documentElement.scrollTop = newScrollTop;
    }
  };

  clearMouseIdleTimer = () => {
    if (this.mouseIdleTimer === null) {
      return;
    }

    clearTimeout(this.mouseIdleTimer);
    this.mouseIdleTimer = null;
  };

  handleMouseMove = throttle(() => {
    // As long as the mouse keeps moving, clear and restart the idle timer.
    this.clearMouseIdleTimer();
    this.mouseIdleTimer = setTimeout(this.handleMouseIdle, MOUSE_IDLE_DELAY);

    if (!this.mouseMovedRecently && this.documentElement.scrollTop === 0) {
      // Only set if we just started moving and are scrolled to the top.
      this.scrollToTopOnMouseIdle = true;
    }

    // Save setting this flag for last, so we can do the comparison above.
    this.mouseMovedRecently = true;
  }, MOUSE_IDLE_DELAY / 2);

  handleMouseIdle = () => {
    if (this.scrollToTopOnMouseIdle) {
      this.setScrollTop(0);
    }

    this.mouseMovedRecently = false;
    this.scrollToTopOnMouseIdle = false;
  }

  componentDidMount() {
    this.window = window;
    this.documentElement = document.scrollingElement || document.documentElement;

    this.attachScrollListener();
    this.attachIntersectionObserver();
    // Handle initial scroll posiiton
    this.handleScroll();
  }

  getScrollPosition = () => {
    if (this.documentElement && (this.documentElement.scrollTop > 0 || this.mouseMovedRecently)) {
      return { height: this.documentElement.scrollHeight, top: this.documentElement.scrollTop };
    } else {
      return null;
    }
  }

  updateScrollBottom = (snapshot) => {
    const newScrollTop = this.documentElement.scrollHeight - snapshot;

    this.setScrollTop(newScrollTop);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    if (snapshot !== null) {
      this.setScrollTop(this.documentElement.scrollHeight - snapshot);
    }
  }

  attachScrollListener() {
    this.window.addEventListener('scroll', this.handleScroll);
    this.window.addEventListener('wheel', this.handleWheel);
  }

  detachScrollListener() {
    this.window.removeEventListener('scroll', this.handleScroll);
    this.window.removeEventListener('wheel', this.handleWheel);
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop, scrollHeight } = this.documentElement;
      const { innerHeight } = this.window;
      const offset = scrollHeight - scrollTop - innerHeight;

      if (400 > offset && this.props.onLoadMore && this.props.hasMore && !this.props.isLoading) {
        this.props.onLoadMore();
      }

      if (scrollTop < 100 && this.props.onScrollToTop) {
        this.props.onScrollToTop();
      } else if (this.props.onScroll) {
        this.props.onScroll();
      }

      if (!this.lastScrollWasSynthetic) {
        // If the last scroll wasn't caused by setScrollTop(), assume it was
        // intentional and cancel any pending scroll reset on mouse idle
        this.scrollToTopOnMouseIdle = false;
      }
      this.lastScrollWasSynthetic = false;
    }
  }, 150, {
    trailing: true,
  });

  handleWheel = throttle(() => {
    this.scrollToTopOnMouseIdle = false;
  }, 150, {
    trailing: true,
  });

  getSnapshotBeforeUpdate(prevProps) {
    const someItemInserted = React.Children.count(prevProps.children) > 0 &&
      React.Children.count(prevProps.children) < React.Children.count(this.props.children) &&
      this.getFirstChildKey(prevProps) !== this.getFirstChildKey(this.props);

    if (someItemInserted && (this.documentElement.scrollTop > 0 || this.mouseMovedRecently)) {
      return this.documentElement.scrollHeight - this.documentElement.scrollTop;
    } else {
      return null;
    }
  }

  cacheMediaWidth = (width) => {
    if (width && this.state.cachedMediaWidth !== width) {
      this.setState({ cachedMediaWidth: width });
    }
  }

  componentWillUnmount() {
    this.clearMouseIdleTimer();
    this.detachScrollListener();
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver() {
    this.intersectionObserverWrapper.connect();
  }

  detachIntersectionObserver() {
    this.intersectionObserverWrapper.disconnect();
  }

  getFirstChildKey(props) {
    const { children } = props;
    let firstChild     = children;

    if (children instanceof ImmutableList) {
      firstChild = children.get(0);
    } else if (Array.isArray(children)) {
      firstChild = children[0];
    }

    return firstChild && firstChild.key;
  }

  handleLoadMore = e => {
    e.preventDefault();
    this.props.onLoadMore();
  }

  getMoreFollows = () => {
    const { scrollKey, isLoading, diffCount, hasMore } = this.props;
    const isMoreFollows = ['followers', 'following'].some(k => k === scrollKey);
    if (!(diffCount && isMoreFollows)) return null;
    if (hasMore) return null;

    return (
      <MoreFollows visible={!isLoading} count={diffCount} type={scrollKey} />
    );
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { children, scrollKey, showLoading, isLoading, hasMore, prepend, alwaysPrepend, emptyMessage, onLoadMore } = this.props;
    const childrenCount = React.Children.count(children);
    const trackScroll = true; //placeholder

    const loadMore     = (hasMore && onLoadMore) ? <LoadMore visible={!isLoading} onClick={this.handleLoadMore} /> : null;
    let scrollableArea = null;

    if (showLoading) {
      scrollableArea = (
        <div className='slist slist--flex'>
          <div role='feed' className='item-list'>
            {prepend}
          </div>

          <div className='slist__append'>
            <LoadingIndicator />
          </div>
        </div>
      );
    } else if (isLoading || childrenCount > 0 || hasMore || !emptyMessage) {
      scrollableArea = (
        <div className='slist' ref={this.setRef} onMouseMove={this.handleMouseMove}>
          <div role='feed' className='item-list'>
            {prepend}

            {React.Children.map(this.props.children, (child, index) => (
              <IntersectionObserverArticleContainer
                key={child.key}
                id={child.key}
                index={index}
                listLength={childrenCount}
                intersectionObserverWrapper={this.intersectionObserverWrapper}
                saveHeightKey={trackScroll ? `${this.context.router.route.location.key}:${scrollKey}` : null}
              >
                {React.cloneElement(child, {
                  getScrollPosition: this.getScrollPosition,
                  updateScrollBottom: this.updateScrollBottom,
                  cachedMediaWidth: this.state.cachedMediaWidth,
                  cacheMediaWidth: this.cacheMediaWidth,
                })}
              </IntersectionObserverArticleContainer>
            ))}
            {this.getMoreFollows()}
            {loadMore}
          </div>
        </div>
      );
    } else {
      scrollableArea = (
        <div className='slist slist--flex' ref={this.setRef}>
          {alwaysPrepend && prepend}

          <div className='empty-column-indicator'>
            <div>{emptyMessage}</div>
          </div>
        </div>
      );
    }

    return scrollableArea;
  }

}
