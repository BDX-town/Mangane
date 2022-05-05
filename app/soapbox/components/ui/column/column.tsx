import classNames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Helmet from 'soapbox/components/helmet';
import { useSoapboxConfig } from 'soapbox/hooks';

import { Card, CardBody, CardHeader, CardTitle } from '../card/card';

interface IColumn {
  /** Route the back button goes to. */
  backHref?: string,
  /** Column title text. */
  label?: string,
  /** Whether this column should have a transparent background. */
  transparent?: boolean,
  /** Whether this column should have a title and back button. */
  withHeader?: boolean,
  /** Extra class name for top <div> element. */
  className?: string,
}

/** A backdrop for the main section of the UI. */
const Column: React.FC<IColumn> = React.forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
  const { backHref, children, label, transparent = false, withHeader = true, className } = props;

  const history = useHistory();
  const soapboxConfig = useSoapboxConfig();

  const handleBackClick = () => {
    if (backHref) {
      history.push(backHref);
      return;
    }

    if (history.length === 1) {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  const renderChildren = () => {
    if (transparent) {
      return <div className={classNames('text-black dark:text-white', className)}>{children}</div>;
    }

    return (
      <Card variant='rounded' className={className}>
        {withHeader ? (
          <CardHeader onBackClick={handleBackClick}>
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
    <div role='region' className='relative' ref={ref} aria-label={label} column-type={transparent ? 'transparent' : 'filled'}>
      <Helmet>
        <title>{label}</title>

        {soapboxConfig.appleAppId && (
          <meta
            data-react-helmet='true'
            name='apple-itunes-app'
            content={`app-id=${soapboxConfig.appleAppId}, app-argument=${location.href}`}
          />
        )}
      </Helmet>

      {renderChildren()}
    </div>
  );
});

export default Column;
