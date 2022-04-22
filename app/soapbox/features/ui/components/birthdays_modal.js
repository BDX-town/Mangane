import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import IconButton from 'soapbox/components/icon_button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ScrollableList from 'soapbox/components/scrollable_list';
import Account from 'soapbox/features/birthdays/account';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = (state) => {
  const me = state.get('me');

  return {
    accountIds: state.getIn(['user_lists', 'birthday_reminders', me]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
@withRouter
class BirthdaysModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    history: PropTypes.object,
  };

  componentDidMount() {
    this.unlistenHistory = this.props.history.listen((_, action) => {
      if (action === 'PUSH') {
        this.onClickClose(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
  }

  onClickClose = (_, noPop) => {
    this.props.onClose('BIRTHDAYS', noPop);
  };

  render() {
    const { intl, accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <LoadingIndicator />;
    } else {
      const emptyMessage = <FormattedMessage id='status.reblogs.empty' defaultMessage='No one has reposted this post yet. When someone does, they will show up here.' />;

      body = (
        <ScrollableList
          scrollKey='reblogs'
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <Account key={id} accountId={id} withNote={false} />,
          )}
        </ScrollableList>
      );
    }


    return (
      <div className='modal-root__modal reactions-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            <FormattedMessage id='column.birthdays' defaultMessage='Birthdays' />
          </h3>
          <IconButton
            className='compose-modal__close'
            title={intl.formatMessage(messages.close)}
            src={require('@tabler/icons/icons/x.svg')}
            onClick={this.onClickClose} size={20}
          />
        </div>
        {body}
      </div>
    );
  }

}
