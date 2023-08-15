import debounce from 'lodash/debounce';
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

  const domains = useAppSelector((state) => state.domain_lists.blocks.items);
  const hasMore = useAppSelector((state) => !!state.domain_lists.blocks.next);
  const loading = useAppSelector((state) => state.domain_lists.blocks.isLoading);


  React.useEffect(() => {
    dispatch(fetchDomainBlocks());
  }, []);

  const emptyMessage = <FormattedMessage id='empty_column.domain_blocks' defaultMessage='There are no hidden domains yet.' />;

  return (
    <Column icon='minus-circle' label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='domain_blocks'
        onLoadMore={() => handleLoadMore(dispatch)}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
        itemClassName='flex flex-col gap-3'
      >
        {domains.map((domain) => (
          <div className='rounded p-1 bg-gray-100 dark:bg-slate-900'>
            <Domain key={domain} domain={domain} />
          </div>
        ))}
        {
          loading && <Spinner />
        }
      </ScrollableList>
    </Column>
  );
};

export default DomainBlocks;
