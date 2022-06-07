import React from 'react';

import { Card, CardBody, Spinner } from 'soapbox/components/ui';

const ColumnLoading = () => (
  <Card variant='rounded'>
    <CardBody>
      <Spinner />
    </CardBody>
  </Card>
);

export default ColumnLoading;
