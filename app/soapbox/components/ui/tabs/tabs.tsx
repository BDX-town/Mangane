import { useRect } from '@reach/rect';
import {
  Tabs as ReachTabs,
  TabList as ReachTabList,
  Tab as ReachTab,
  useTabsContext,
} from '@reach/tabs';
import classNames from 'classnames';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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

  const top: number = (activeRect && activeRect.bottom) - (rect && rect.top);
  const width: number = activeRect && activeRect.width - HORIZONTAL_PADDING * 2;
  const left: number = (activeRect && activeRect.left) - (rect && rect.left) + HORIZONTAL_PADDING;

  return (
    <AnimatedContext.Provider value={setActiveRect}>
      <ReachTabs {...rest} ref={ref}>
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
      setActiveRect(rect);
    }
  }, [isSelected, rect, setActiveRect]);

  return (
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
interface ITabs extends RouteComponentProps<any> {
  items: Item[],
  activeItem: string,
}

const Tabs = ({ items, activeItem, history }: ITabs) => {
  const defaultIndex = items.findIndex(({ name }) => name === activeItem);

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

export default withRouter(Tabs);
