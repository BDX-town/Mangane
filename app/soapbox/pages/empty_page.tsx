import React, { ReactNode } from 'react';

import { Layout } from '../components/ui';

const EmptyPage: React.FC = ({ children }: { children: ReactNode}) => {
  return (
    <>
      <Layout.Main className=''>
        {children}
      </Layout.Main>
    </>
  );
};

export default EmptyPage;
