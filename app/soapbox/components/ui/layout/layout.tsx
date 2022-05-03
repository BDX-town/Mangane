import classNames from 'classnames';
import React from 'react';
import StickyBox from 'react-sticky-box';

interface LayoutComponent extends React.FC {
  Sidebar: React.FC,
  Main: React.FC<React.HTMLAttributes<HTMLDivElement>>,
  Aside: React.FC,
}

/** Layout container, to hold Sidebar, Main, and Aside. */
const Layout: LayoutComponent = ({ children }) => (
  <div className='sm:pt-4 relative'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:grid md:grid-cols-12 md:gap-8'>
      {children}
    </div>
  </div>
);

/** Left sidebar container in the UI. */
const Sidebar: React.FC = ({ children }) => (
  <div className='hidden lg:block lg:col-span-3'>
    <StickyBox offsetTop={80} className='pb-4'>
      {children}
    </StickyBox>
  </div>
);

/** Center column container in the UI. */
const Main: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  <main
    className={classNames({
      'md:col-span-12 lg:col-span-9 xl:col-span-6 sm:space-y-4 pb-36': true,
    }, className)}
  >
    {children}
  </main>
);

/** Right sidebar container in the UI. */
const Aside: React.FC = ({ children }) => (
  <aside className='hidden xl:block xl:col-span-3'>
    <StickyBox offsetTop={80} className='space-y-6 pb-12' >
      {children}
    </StickyBox>
  </aside>
);

Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;

export default Layout;
