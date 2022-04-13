import { debounce } from 'lodash';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchDomainBlocks, expandDomainBlocks } from 'soapbox/actions/domain_blocks';
import Domain from 'soapbox/components/domain';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Spinner } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.domain_blocks', defaultMessage: 'Hidden domains' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandDomainBlocks());
}, 300, { leading: true });

const DomainBlocks: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const domains = useAppSelector((state) => state.domain_lists.getIn(['blocks', 'items'])) as string[];
  const hasMore = useAppSelector((state) => !!state.domain_lists.getIn(['blocks', 'next']));

  React.useEffect(() => {
    dispatch(fetchDomainBlocks());
  }, []);

  if (!domains) {
    return (
      <Column>
        <Spinner />
      </Column>
    );
  }

  const emptyMessage = <FormattedMessage id='empty_column.domain_blocks' defaultMessage='There are no hidden domains yet.' />;

  return (
    <Column icon='minus-circle' label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='domain_blocks'
        onLoadMore={() => handleLoadMore(dispatch)}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
      >
        {domains.map((domain) =>
          <Domain key={domain} domain={domain} />,
        )}
      </ScrollableList>
    </Column>
  );
};

export default DomainBlocks;
