import React from 'react';

import { Layout } from '../components/ui';

const EmptyPage: React.FC = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar />

      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside />
    </Layout>
  );
};

export default EmptyPage;
