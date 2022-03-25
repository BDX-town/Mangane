import React from 'react';

import { Stack, Text } from 'soapbox/components/ui';

interface IWidgetTitle {
  title: string | React.ReactNode
}

const WidgetTitle = ({ title }: IWidgetTitle): JSX.Element => (
  <Text size='xl' weight='bold' tag='h1'>{title}</Text>
);

const WidgetBody: React.FC = ({ children }): JSX.Element => (
  <Stack space={3}>{children}</Stack>
);

interface IWidget {
  title: string | React.ReactNode,
}

const Widget: React.FC<IWidget> = ({ title, children }): JSX.Element => {
  return (
    <Stack space={2}>
      <WidgetTitle title={title} />
      <WidgetBody>{children}</WidgetBody>
    </Stack>
  );
};

export default Widget;
