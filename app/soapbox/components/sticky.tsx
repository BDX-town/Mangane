import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ISticky {
    className?: string,
    stickyClassName?: string,
    children: React.ReactElement,
}

function findNearestScrollableAncestor(el: HTMLElement) {
  if (!el) return undefined;
  const styles = getComputedStyle(el);
  if ((styles.overflowY === 'auto' || styles.overflowY === 'scroll')) return el;
  return findNearestScrollableAncestor(el.parentElement);
}

const Sticky: React.FC<ISticky> = ({ className, stickyClassName, children }) => {
  const root = React.useRef<HTMLDivElement>(null);
  const node = React.useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = React.useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const lastScrollTop = useRef(Infinity);

  const onSticky = React.useCallback((e) => {
    if (e.find((entry) => entry.isIntersecting === false)) setSticky(true);
    else setSticky(false);
  }, []);

  const onScroll = useCallback((e: Event) => {
    const ancestor = e.target as HTMLElement;
    if (ancestor.scrollTop > lastScrollTop.current) setScrollingUp(false);
    else setScrollingUp(true);
    lastScrollTop.current = ancestor.scrollTop;
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(onSticky, { threshold: [0, 1.0] });

    observer.observe(root.current);

    return () => {
      observer.disconnect();
    };
  }, [onSticky]);

  useEffect(() => {
    const ancestor = findNearestScrollableAncestor(root.current);
    ancestor.addEventListener('scroll', onScroll, { passive: true });
    lastScrollTop.current = ancestor.scrollTop;

    return () => ancestor.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <>
      <div ref={root} className={className}>
        { children }
      </div>
      {
        sticky && scrollingUp && (
          <div ref={node} className={`component-sticky__fixed fixed top-0 z-50 ${stickyClassName}`}>
            { children }
          </div>
        )
      }
    </>
  );
};

export default Sticky;