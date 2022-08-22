import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchPatronInstance } from 'soapbox/actions/patron';
import { Widget, Button, ProgressBar, Text } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

/** Open link in a new tab. */
// https://stackoverflow.com/a/28374344/8811886
const openInNewTab = (href: string): void => {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    href: href,
  }).click();
};

/** Formats integer to USD string. */
const moneyFormat = (amount: number): string => (
  new Intl
    .NumberFormat('en-US', {
      style: 'currency',
      currency: 'usd',
      notation: 'compact',
    })
    .format(amount / 100)
);

const FundingPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const patron = useAppSelector(state => state.patron.instance);

  useEffect(() => {
    dispatch(fetchPatronInstance());
  }, []);

  if (patron.funding.isEmpty() || patron.goals.isEmpty()) return null;

  const amount = patron.getIn(['funding', 'amount']) as number;
  const goal = patron.getIn(['goals', '0', 'amount']) as number;
  const goalText = patron.getIn(['goals', '0', 'text']) as string;
  const goalReached = amount >= goal;
  let ratioText;

  if (goalReached) {
    ratioText = <><strong>{moneyFormat(goal)}</strong> per month<span className='funding-panel__reached'>&mdash; reached!</span></>;
  } else {
    ratioText = <><strong>{moneyFormat(amount)} out of {moneyFormat(goal)}</strong> per month</>;
  }

  const handleDonateClick = () => {
    openInNewTab(patron.url);
  };

  return (
    <Widget
      title={<FormattedMessage id='patron.title' defaultMessage='Funding Goal' />}
      onActionClick={handleDonateClick}
    >
      <div className='funding-panel__ratio'>
        <Text>{ratioText}</Text>
      </div>
      <ProgressBar progress={amount / goal} />
      <div className='funding-panel__description'>
        <Text>{goalText}</Text>
      </div>
      <div>
        <Button theme='ghost' onClick={handleDonateClick}>
          <FormattedMessage id='patron.donate' defaultMessage='Donate' />
        </Button>
      </div>
    </Widget>
  );
};

export default FundingPanel;
