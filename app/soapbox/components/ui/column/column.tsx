import React from 'react';

import Helmet from 'soapbox/components/helmet';

import { Card, CardBody, CardHeader, CardTitle } from '../card/card';

interface IColumn {
  backHref?: string,
  label?: string,
  transparent?: boolean,
  withHeader?: boolean,
}

const Column: React.FC<IColumn> = React.forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
  const { backHref, children, label, transparent = false, withHeader = true } = props;

  const renderChildren = () => {
    if (transparent) {
      return <div className='bg-white sm:bg-transparent'>{children}</div>;
    }

    return (
      <Card variant='rounded'>
        {withHeader ? (
          <CardHeader backHref={backHref}>
            <CardTitle title={label} />
          </CardHeader>
        ) : null}

        <CardBody>
          {children}
        </CardBody>
      </Card>
    );
  };

  return (
    <div role='region' ref={ref} aria-label={label} column-type={transparent ? 'transparent' : 'filled'}>
      <Helmet><title>{label}</title></Helmet>

      {renderChildren()}
    </div>
  );
});

export default Column;
