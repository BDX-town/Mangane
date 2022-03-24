import { useRect } from '@reach/rect';
import {
  Tabs as ReachTabs,
  TabList as ReachTabList,
  Tab as ReachTab,
  useTabsContext,
} from '@reach/tabs';
import classNames from 'classnames';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import './tabs.css';

const HORIZONTAL_PADDING = 8;
const AnimatedContext = React.createContext(null);

interface IAnimatedInterface {
  onChange(index: number): void,
  defaultIndex: number
}

const AnimatedTabs: React.FC<IAnimatedInterface> = ({ children, ...rest }) => {
  const [activeRect, setActiveRect] = React.useState(null);
  const ref = React.useRef();
  const rect = useRect(ref);

  // @ts-ignore
  const top: number = (activeRect && activeRect.bottom) - (rect && rect.top);
  // @ts-ignore
  const width: number = activeRect && activeRect.width - HORIZONTAL_PADDING * 2;
  // @ts-ignore
  const left: number = (activeRect && activeRect.left) - (rect && rect.left) + HORIZONTAL_PADDING;

  return (
    // @ts-ignore
    <AnimatedContext.Provider value={setActiveRect}>
      <ReachTabs
        {...rest}
        // @ts-ignore
        ref={ref}
      >
        <div
          className='w-full h-[3px] bg-primary-200 absolute'
          style={{ top }}
        />
        <div
          className={classNames('absolute h-[3px] bg-primary-600 transition-all duration-200', {
            'hidden': top <= 0,
          })}
          style={{ left, top, width }}
        />
        {children}
      </ReachTabs>
    </AnimatedContext.Provider>
  );
};

interface IAnimatedTab {
  role: 'button',
  as: 'a' | 'button',
  href?: string,
  title: string,
  index: number
}

const AnimatedTab: React.FC<IAnimatedTab> = ({ index, ...props }) => {
  // get the currently selected index from useTabsContext
  const { selectedIndex } = useTabsContext();
  const isSelected: boolean = selectedIndex === index;

  // measure the size of our element, only listen to rect if active
  const ref = React.useRef();
  const rect = useRect(ref, { observe: isSelected });

  // get the style changing function from context
  const setActiveRect = React.useContext(AnimatedContext);

  // callup to set styles whenever we're active
  React.useLayoutEffect(() => {
    if (isSelected) {
      // @ts-ignore
      setActiveRect(rect);
    }
  }, [isSelected, rect, setActiveRect]);

  return (
    // @ts-ignore
    <ReachTab ref={ref} {...props} />
  );
};

type Item = {
  text: string,
  title?: string,
  href?: string,
  to?: string,
  action?: () => void,
  name: string
}
interface ITabs {
  items: Item[],
  activeItem: string,
}

const Tabs = ({ items, activeItem }: ITabs) => {
  const defaultIndex = items.findIndex(({ name }) => name === activeItem);

  const history = useHistory();

  const onChange = (selectedIndex: number) => {
    const item = items[selectedIndex];

    if (typeof item.action === 'function') {
      item.action();
    } else if (item.to) {
      history.push(item.to);
    }
  };

  const renderItem = (item: Item, idx: number) => {
    const { name, text, title } = item;

    return (
      <AnimatedTab
        key={name}
        as='button'
        role='button'
        // @ts-ignore
        title={title}
        index={idx}
      >
        {text}
      </AnimatedTab>
    );
  };

  return (
    <AnimatedTabs onChange={onChange} defaultIndex={defaultIndex}>
      <ReachTabList>
        {items.map((item, i) => renderItem(item, i))}
      </ReachTabList>
    </AnimatedTabs>
  );
};

export default Tabs;
