import React from 'react';
import { v4 } from 'uuid';

import Pullable from 'soapbox/components/pullable';
import { Column } from 'soapbox/components/ui';

import ColumnHeader from './column_header';

import type { IColumn } from 'soapbox/components/ui/column/column';

interface IUIColumn extends IColumn {
  heading?: string | React.ReactNode,
  icon?: string,
  active?: boolean,
}

const UIColumn: React.FC<IUIColumn> = ({
  heading,
  icon,
  children,
  active,
  ...rest
}) => {
  const columnHeaderId = typeof heading === 'string' ? heading.replace(/ /g, '-') : v4();

  return (
    <Column aria-labelledby={columnHeaderId} {...rest}>
      {heading && <ColumnHeader icon={icon} active={active} type={heading as any} columnHeaderId={columnHeaderId} />}
      <Pullable>
        {children}
      </Pullable>
    </Column>
  );

};

export default UIColumn;
