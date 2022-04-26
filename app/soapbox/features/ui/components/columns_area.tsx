import React from 'react';

import { Layout } from '../../../components/ui';

interface IColumnsArea {
  layout: any,
}

const ColumnsArea: React.FC<IColumnsArea> = (props) => {
  const { children } = props;
  const layout = props.layout || { LEFT: null, RIGHT: null };

  return (
    <Layout>
      <Layout.Sidebar>
        {layout.LEFT}
      </Layout.Sidebar>

      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside>
        {layout.RIGHT}
      </Layout.Aside>
    </Layout>
  );
};

export default ColumnsArea;
