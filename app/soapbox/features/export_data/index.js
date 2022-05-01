import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
  exportFollows,
  exportBlocks,
  exportMutes,
} from 'soapbox/actions/export_data';
import { getFeatures } from 'soapbox/utils/features';

import Column from '../ui/components/column';

import CSVExporter from './components/csv_exporter';

const messages = defineMessages({
  heading: { id: 'column.export_data', defaultMessage: 'Export data' },
  submit: { id: 'export_data.actions.export', defaultMessage: 'Export' },
});

const followMessages = defineMessages({
  input_label: { id: 'export_data.follows_label', defaultMessage: 'Follows' },
  input_hint: { id: 'export_data.hints.follows', defaultMessage: 'Get a CSV file containing a list of followed accounts' },
  submit: { id: 'export_data.actions.export_follows', defaultMessage: 'Export follows' },
});

const blockMessages = defineMessages({
  input_label: { id: 'export_data.blocks_label', defaultMessage: 'Blocks' },
  input_hint: { id: 'export_data.hints.blocks', defaultMessage: 'Get a CSV file containing a list of blocked accounts' },
  submit: { id: 'export_data.actions.export_blocks', defaultMessage: 'Export blocks' },
});

const muteMessages = defineMessages({
  input_label: { id: 'export_data.mutes_label', defaultMessage: 'Mutes' },
  input_hint: { id: 'export_data.hints.mutes', defaultMessage: 'Get a CSV file containing a list of muted accounts' },
  submit: { id: 'export_data.actions.export_mutes', defaultMessage: 'Export mutes' },
});

const mapStateToProps = state => ({
  features: getFeatures(state.get('instance')),
});

export default @connect(mapStateToProps)
@injectIntl
class ExportData extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    features: PropTypes.object,
  };

  render() {
    const { intl } = this.props;

    return (
      <Column icon='cloud-download-alt' label={intl.formatMessage(messages.heading)}>
        <CSVExporter action={exportFollows} messages={followMessages} />
        <CSVExporter action={exportBlocks} messages={blockMessages} />
        <CSVExporter action={exportMutes} messages={muteMessages} />
      </Column>
    );
  }

}
