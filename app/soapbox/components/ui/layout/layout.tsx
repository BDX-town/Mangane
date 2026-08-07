import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface LayoutComponent extends React.FC {
  Sidebar: React.FC,
  Main: React.FC<React.HTMLAttributes<HTMLDivElement>>,
  Aside: React.FC<{ className?: string, children: ReactNode }>,
}

/** Layout container, to hold Sidebar, Main, and Aside. */
const Layout: LayoutComponent = ({ children }: { children: ReactNode }) => (
  <div className='relative'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:flex md:gap-8 h-screen overflow-y-auto grow'>
      {children}
    </div>
  </div>
);

/** Left sidebar container in the UI. */
const Sidebar: React.FC = ({ children }: { children: ReactNode }) => (
  <div className='hidden lg:block lg:col-span-3 md:min-w-[300px] md:max-w-[300px] sm:py-4'>
    {children}
  </div>
);

/** Center column container in the UI. */
const Main: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  // pb is here to let space for the bottom bar
  <main className={classNames('md:w-full md:min-w-0 md:overflow-y-auto animate-fadein grow flex flex-col sm:pt-4 pb-[110px] lg:pb-0 ', className)}>
    {children}
  </main>
);

/** Right sidebar container in the UI. */
const Aside: React.FC<{ className?: string, children: ReactNode }> = ({ children, className }) => (
  <aside className={`hidden lg:flex flex-col lg:col-span-3 md:min-w-[200px] md:max-w-[200px] grow animate-fadein sm:py-4 ${className || ''}`}>
    {children}
  </aside>
);

Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;

export default Layout;
