import React from 'react';
import { connect } from 'react-redux';
import { changeReportComment, changeReportForward, changeReportBlock, submitReport } from '../../../actions/reports';
import { blockAccount } from '../../../actions/accounts';
import { expandAccountTimeline } from '../../../actions/timelines';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { makeGetAccount } from '../../../selectors';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import StatusCheckBox from '../../report/containers/status_check_box_container';
import { OrderedSet } from 'immutable';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Button from '../../../components/button';
import Toggle from 'react-toggle';
import IconButton from '../../../components/icon_button';
import { isRemote, getDomain } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => {
    const accountId = state.getIn(['reports', 'new', 'account_id']);
    const account = getAccount(state, accountId);
    const instance = state.get('instance');
    const features = getFeatures(instance);

    return {
      isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
      account,
      comment: state.getIn(['reports', 'new', 'comment']),
      forward: state.getIn(['reports', 'new', 'forward']),
      block: state.getIn(['reports', 'new', 'block']),
      statusIds: OrderedSet(state.getIn(['timelines', `account:${accountId}:with_replies`, 'items'])).union(state.getIn(['reports', 'new', 'status_ids'])),
      canForward: isRemote(account) && features.federating,
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class ReportModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool,
    account: ImmutablePropTypes.map,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    comment: PropTypes.string.isRequired,
    forward: PropTypes.bool,
    block: PropTypes.bool,
    canForward: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleCommentChange = e => {
    this.props.dispatch(changeReportComment(e.target.value));
  }

  handleForwardChange = e => {
    this.props.dispatch(changeReportForward(e.target.checked));
  }

  handleBlockChange = e => {
    this.props.dispatch(changeReportBlock(e.target.checked));
  }

  handleSubmit = () => {
    this.props.dispatch(submitReport());
    if (this.props.block) {
      this.props.dispatch(blockAccount(this.props.account.get('id')));
    }
  }

  handleKeyDown = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }

  componentDidMount() {
    this.props.dispatch(expandAccountTimeline(this.props.account.get('id'), { withReplies: true }));
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props;
    if (prevProps.account !== account && account) {
      this.props.dispatch(expandAccountTimeline(account.get('id'), { withReplies: true }));
    }
  }

  render() {
    const { account, comment, intl, statusIds, isSubmitting, forward, block, canForward, onClose } = this.props;

    if (!account) {
      return null;
    }

    return (
      <div className='modal-root__modal report-modal'>
        <div className='report-modal__target'>
          <IconButton className='media-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={onClose} size={16} />
          <FormattedMessage id='report.target' defaultMessage='Reporting {target}' values={{ target: <strong>{account.get('acct')}</strong> }} />
        </div>

        <div className='report-modal__container'>
          <div className='report-modal__comment'>
            <p><FormattedMessage id='report.hint' defaultMessage='The report will be sent to your server moderators. You can provide an explanation of why you are reporting this account below:' /></p>

            <textarea
              className='setting-text light'
              placeholder={intl.formatMessage(messages.placeholder)}
              value={comment}
              onChange={this.handleCommentChange}
              onKeyDown={this.handleKeyDown}
              disabled={isSubmitting}
              autoFocus
            />

            {canForward && (
              <div>
                <p><FormattedMessage id='report.forward_hint' defaultMessage='The account is from another server. Send a copy of the report there as well?' /></p>

                <div className='setting-toggle'>
                  <Toggle id='report-forward' checked={forward} disabled={isSubmitting} onChange={this.handleForwardChange} />
                  <label htmlFor='report-forward' className='setting-toggle__label'><FormattedMessage id='report.forward' defaultMessage='Forward to {target}' values={{ target: getDomain(account) }} /></label>
                </div>
              </div>
            )}

            <div>
              <p><FormattedMessage id='report.block_hint' defaultMessage='Do you also want to block this account?' /></p>

              <div className='setting-toggle'>
                <Toggle id='report-block' checked={block} disabled={isSubmitting} onChange={this.handleBlockChange} />
                <label htmlFor='report-block' className='setting-toggle__label'><FormattedMessage id='report.block' defaultMessage='Block {target}' values={{ target: account.get('acct') }} /></label>
              </div>
            </div>

            <Button disabled={isSubmitting} text={intl.formatMessage(messages.submit)} onClick={this.handleSubmit} />
          </div>

          <div className='report-modal__statuses'>
            <div>
              {statusIds.map(statusId => <StatusCheckBox id={statusId} key={statusId} disabled={isSubmitting} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
