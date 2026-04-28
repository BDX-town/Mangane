import classNames from 'classnames';
import React, { ReactNode } from 'react';
import StickyBox from 'react-sticky-box';

interface LayoutComponent extends React.FC {
  Sidebar: React.FC<{ children?: ReactNode }>,
  Main: React.FC<React.HTMLAttributes<HTMLDivElement>>,
  Aside: React.FC<{ children?: ReactNode, className?: string }>,
}

/** Layout container, to hold Sidebar, Main, and Aside. */
const Layout: LayoutComponent = ({ children }: { children?: ReactNode }) => (
  <div className='relative'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:flex md:gap-8 md:max-h-screen'>
      {children}
    </div>
  </div>
);

/** Left sidebar container in the UI. */
const Sidebar: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className='hidden lg:block lg:col-span-3 md:min-w-[300px] md:max-w-[300px]'>
      {children}
  </div>
);

/** Center column container in the UI. */
const Main: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  <main
    className={classNames(
      "md:w-full md:min-w-0 md:overflow-y-auto",
      className,
    )}
  >
    {children}
  </main>
);

/** Right sidebar container in the UI. */
const Aside: React.FC<{ className?: string, children?: ReactNode }> = ({ children, className }) => (
  <aside className={`hidden lg:block lg:col-span-3 md:min-w-[200px] md:max-w-[200px] ${className || ''}`}>
      {children}
  </aside>
);

Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;

export default Layout;
