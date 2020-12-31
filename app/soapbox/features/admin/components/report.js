import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import Avatar from 'soapbox/components/avatar';

export default class Report extends ImmutablePureComponent {

  static propTypes = {
    report: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { report } = this.props;

    return (
      <div className='admin-report' key={report.get('id')}>
        <Avatar account={report.get('account')} size={32} />
        <div className='admin-report__content'>
          <h4 className='admin-report__title'>
            <FormattedMessage
              id='admin.reports.report_title'
              defaultMessage='Report on {acct}'
              values={{ acct:  `@${report.getIn(['account', 'acct'])}` }}
            />
          </h4>
          <div class='admin-report__quote'>
            <blockquote className='md'>{report.get('content')}</blockquote>
            <span className='byline'>&mdash; @{report.getIn(['actor', 'acct'])}</span>
          </div>
        </div>
      </div>
    );
  }

}
