import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusContainer from '../../../containers/status_container';
import AccountContainer from '../../../containers/account_container';
import { injectIntl, FormattedMessage } from 'react-intl';
import Permalink from '../../../components/permalink';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';


export default @injectIntl
class Report extends ImmutablePureComponent {

  static propTypes = {
    report: ImmutablePropTypes.map.isRequired,
    state: ImmutablePropTypes.map,
  };


  render() {
    const { intl, report } = this.props;

    return (
      <div class="report">
        <FormattedMessage id='empty_column.report_test' defaultMessage="Open Report Item" />
        <AccountContainer id={report.getIn(['account', 'id'])} withNote={false} />

      </div>
    );
  }

}
