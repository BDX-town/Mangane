import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchStatusWithContext } from 'soapbox/actions/statuses';
import IconButton from 'soapbox/components/icon_button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ScrollableList from 'soapbox/components/scrollable_list';
import AccountContainer from 'soapbox/containers/account_container';
import { makeGetStatus } from 'soapbox/selectors';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus();
  const status = getStatus(state, {
    id: props.statusId,
    username: props.username,
  });

  return {
    accountIds: status ? ImmutableOrderedSet(status.get('mentions').map(m => m.get('id'))) : null,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class MentionsModal extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    statusId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
  };

  fetchData = () => {
    const { dispatch, statusId } = this.props;

    dispatch(fetchStatusWithContext(statusId));
  }

  componentDidMount() {
    this.fetchData();
    this.unlistenHistory = this.context.router.history.listen((_, action) => {
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
    this.props.onClose('MENTIONS', noPop);
  };

  render() {
    const { intl, accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <LoadingIndicator />;
    } else {
      body = (
        <ScrollableList
          scrollKey='mentions'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      );
    }

    return (
      <div className='modal-root__modal reactions-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            <FormattedMessage id='column.mentions' defaultMessage='Mentions' />
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
