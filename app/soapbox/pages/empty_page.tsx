import React, { ReactNode } from 'react';

import { Layout } from '../components/ui';

const EmptyPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Layout.Main className='py-4'>
        {children}
      </Layout.Main>

      <Layout.Aside />
    </>
  );
};

export default EmptyPage;
