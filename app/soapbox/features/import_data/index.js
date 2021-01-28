import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import {
  importFollows,
  importBlocks,
  importMutes,
} from 'soapbox/actions/import_data';
import CSVImporter from './components/csv_importer';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  heading: { id: 'column.import_data', defaultMessage: 'Import data' },
  submit: { id: 'import_data.actions.import', defaultMessage: 'Import' },
});

const followMessages = defineMessages({
  input_label: { id: 'import_data.follows_label', defaultMessage: 'Follows' },
  input_hint: { id: 'import_data.hints.follows', defaultMessage: 'CSV file containing a list of followed accounts' },
  submit: { id: 'import_data.actions.import_follows', defaultMessage: 'Import follows' },
});

const blockMessages = defineMessages({
  input_label: { id: 'import_data.blocks_label', defaultMessage: 'Blocks' },
  input_hint: { id: 'import_data.hints.blocks', defaultMessage: 'CSV file containing a list of blocked accounts' },
  submit: { id: 'import_data.actions.import_blocks', defaultMessage: 'Import blocks' },
});

const muteMessages = defineMessages({
  input_label: { id: 'import_data.mutes_label', defaultMessage: 'Mutes' },
  input_hint: { id: 'import_data.hints.mutes', defaultMessage: 'CSV file containing a list of muted accounts' },
  submit: { id: 'import_data.actions.import_mutes', defaultMessage: 'Import mutes' },
});

const mapStateToProps = state => ({
  features: getFeatures(state.get('instance')),
});

export default @connect(mapStateToProps)
@injectIntl
class ImportData extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    features: PropTypes.object,
  };

  render() {
    const { intl, features } = this.props;

    return (
      <Column icon='cloud-upload' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <CSVImporter action={importFollows} messages={followMessages} />
        <CSVImporter action={importBlocks} messages={blockMessages} />
        {features.importMutes && <CSVImporter action={importMutes} messages={muteMessages} />}
      </Column>
    );
  }

}
