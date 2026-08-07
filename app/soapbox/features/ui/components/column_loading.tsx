import React from 'react';

import { Card, CardBody, Spinner } from 'soapbox/components/ui';

const ColumnLoading = () => (
  <Card variant='rounded' className='animate-fadein'>
    <CardBody>
      <Spinner />
    </CardBody>
  </Card>
);

export default ColumnLoading;
