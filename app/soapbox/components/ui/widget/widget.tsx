import React from 'react';

import { Text, IconButton } from 'soapbox/components/ui';
import HStack from 'soapbox/components/ui/hstack/hstack';
import Stack from 'soapbox/components/ui/stack/stack';

interface IWidgetTitle {
  title: string | React.ReactNode,
}

const WidgetTitle = ({ title }: IWidgetTitle): JSX.Element => (
  <Text size='xl' weight='bold' tag='h1'>{title}</Text>
);

const WidgetBody: React.FC = ({ children }): JSX.Element => (
  <Stack space={3}>{children}</Stack>
);

interface IWidget {
  title: string | React.ReactNode,
  onActionClick?: () => void,
  actionIcon?: string,
  actionTitle?: string,
}

const Widget: React.FC<IWidget> = ({
  title,
  children,
  onActionClick,
  actionIcon = require('@tabler/icons/icons/arrow-right.svg'),
  actionTitle,
}): JSX.Element => {
  return (
    <Stack space={2}>
      <HStack alignItems='center'>
        <WidgetTitle title={title} />
        {onActionClick && (
          <IconButton
            className='w-6 h-6 ml-2'
            src={actionIcon}
            onClick={onActionClick}
            title={actionTitle}
          />
        )}
      </HStack>
      <WidgetBody>{children}</WidgetBody>
    </Stack>
  );
};

export default Widget;
