import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import { fetchFilters } from '../../actions/filters';

const messages = defineMessages({
  heading: { id: 'column.filters', defaultMessage: 'Muted words' },
});

const mapStateToProps = state => ({
  filters: state.get('filters'),
});

export default @connect(mapStateToProps)
@injectIntl
class Filters extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchFilters());
  }

  render() {
    const { intl } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.filters' defaultMessage="You haven't created any muted words yet." />;

    return (
      <Column icon='filter' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        {emptyMessage}
      </Column>
    );
  }

}
