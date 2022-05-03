import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';

import { getSubscribersCsv, getUnsubscribersCsv, getCombinedCsv } from 'soapbox/actions/email_list';
import { Text } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch, useOwnAccount, useFeatures } from 'soapbox/hooks';
import sourceCode from 'soapbox/utils/code';
import { parseVersion } from 'soapbox/utils/features';
import { isNumber } from 'soapbox/utils/numbers';

import RegistrationModePicker from '../components/registration_mode_picker';

import type { AxiosResponse } from 'axios';

/** Download the file from the response instead of opening it in a tab. */
// https://stackoverflow.com/a/53230807
const download = (response: AxiosResponse, filename: string) => {
  const url = URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const instance = useAppSelector(state => state.instance);
  const features = useFeatures();
  const account = useOwnAccount();

  const handleSubscribersClick: React.MouseEventHandler = e => {
    dispatch(getSubscribersCsv()).then((response) => {
      download(response, 'subscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const handleUnsubscribersClick: React.MouseEventHandler = e => {
    dispatch(getUnsubscribersCsv()).then((response) => {
      download(response, 'unsubscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const handleCombinedClick: React.MouseEventHandler = e => {
    dispatch(getCombinedCsv()).then((response) => {
      download(response, 'combined.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const v = parseVersion(instance.version);

  const userCount   = instance.stats.get('user_count');
  const statusCount = instance.stats.get('status_count');
  const domainCount = instance.stats.get('domain_count');

  const mau = instance.pleroma.getIn(['stats', 'mau']) as number | undefined;
  const retention = (userCount && mau) ? Math.round(mau / userCount * 100) : null;

  if (!account) return null;

  return (
    <>
      <div className='dashcounters mt-8'>
        {isNumber(mau) && (
          <div className='dashcounter'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={mau} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.mau_label' defaultMessage='monthly active users' />
            </Text>
          </div>
        )}
        {isNumber(userCount) && (
          <Link className='dashcounter' to='/soapbox/admin/users'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={userCount} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='total users' />
            </Text>
          </Link>
        )}
        {isNumber(retention) && (
          <div className='dashcounter'>
            <Text align='center' size='2xl' weight='medium'>
              {retention}%
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.retention_label' defaultMessage='user retention' />
            </Text>
          </div>
        )}
        {isNumber(statusCount) && (
          <Link className='dashcounter' to='/timeline/local'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={statusCount} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />
            </Text>
          </Link>
        )}
        {isNumber(domainCount) && (
          <div className='dashcounter'>
            <Text align='center' size='2xl' weight='medium'>
              <FormattedNumber value={domainCount} />
            </Text>
            <Text align='center'>
              <FormattedMessage id='admin.dashcounters.domain_count_label' defaultMessage='peers' />
            </Text>
          </div>
        )}
      </div>

      {account.admin && <RegistrationModePicker />}

      <div className='dashwidgets'>
        <div className='dashwidget'>
          <h4><FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' /></h4>
          <ul>
            <li>{sourceCode.displayName} <span className='pull-right'>{sourceCode.version}</span></li>
            <li>{v.software + (v.build ? `+${v.build}` : '')} <span className='pull-right'>{v.version}</span></li>
          </ul>
        </div>
        {features.emailList && account.admin && (
          <div className='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.email_list_header' defaultMessage='Email list' /></h4>
            <ul>
              <li><a href='#' onClick={handleSubscribersClick} target='_blank'>subscribers.csv</a></li>
              <li><a href='#' onClick={handleUnsubscribersClick} target='_blank'>unsubscribers.csv</a></li>
              <li><a href='#' onClick={handleCombinedClick} target='_blank'>combined.csv</a></li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
