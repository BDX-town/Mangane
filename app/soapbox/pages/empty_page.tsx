import React from 'react';

import { Layout } from '../components/ui';

const EmptyPage: React.FC = ({ children }) => {
  return (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside />
    </>
  );
};

export default EmptyPage;
