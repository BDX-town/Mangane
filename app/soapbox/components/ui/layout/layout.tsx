import classNames from 'classnames';
import React from 'react';
import StickyBox from 'react-sticky-box';

const Layout: React.FC = ({ children }) => (
  <div className='sm:py-4 relative pb-36'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:grid md:grid-cols-12 md:gap-8'>
      {children}
    </div>
  </div>
);


const Sidebar: React.FC = ({ children }) => (
  <div className='hidden lg:block lg:col-span-3'>
    <StickyBox offsetTop={80} className='pb-4'>
      {children}
    </StickyBox>
  </div>
);

const Main: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  <main
    className={classNames({
      'md:col-span-12 lg:col-span-9 xl:col-span-6 sm:space-y-4': true,
    }, className)}
  >
    {children}
  </main>
);

const Aside: React.FC = ({ children }) => (
  <aside className='hidden xl:block xl:col-span-3'>
    <StickyBox offsetTop={80} className='space-y-6 pb-4' >
      {children}
    </StickyBox>
  </aside>
);

// @ts-ignore
Layout.Sidebar = Sidebar;
// @ts-ignore
Layout.Main = Main;
// @ts-ignore
Layout.Aside = Aside;

export default Layout;
