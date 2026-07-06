import React, { ReactNode } from 'react';

import { Layout } from '../components/ui';

const EmptyPage: React.FC = ({ children }: { children: ReactNode}) => {
  return (
    <>
      <Layout.Main className='animate-fadein pb-[110px] sm:pt-4 lg:pb-0'>
        {children}
      </Layout.Main>

      <Layout.Aside> </Layout.Aside>
    </>
  );
};

export default EmptyPage;
