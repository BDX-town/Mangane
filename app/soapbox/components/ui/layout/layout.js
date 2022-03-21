import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Layout = ({ children }) => (
  <div className='sm:py-4 relative pb-36'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:grid md:grid-cols-12 md:gap-8'>
      {children}
    </div>
  </div>
);


const Sidebar = ({ children }) => (
  <div className='hidden lg:block lg:col-span-3'>
    <div className='sticky top-20'>
      {children}
    </div>
  </div>
);

const Main = ({ children, className }) => (
  <main
    className={classNames({
      'md:col-span-12 lg:col-span-9 xl:col-span-6 sm:space-y-4': true,
      [className]: typeof className !== 'undefined',
    })}
  >
    {children}
  </main>
);

const Aside = ({ children }) => (
  <aside className='hidden xl:block xl:col-span-3'>
    <div className='sticky top-20 space-y-6'>
      {children}
    </div>
  </aside>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

Sidebar.propTypes = {
  children: PropTypes.node,
};

Main.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Aside.propTypes = {
  children: PropTypes.node,
};

Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;

export default Layout;
