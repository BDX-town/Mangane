import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import snackbar from 'soapbox/actions/snackbar';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
  Checkbox,
  FileChooser,
  SimpleTextarea,
} from 'soapbox/features/forms';

import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import { patchMe } from 'soapbox/actions/me';
import { unescape } from 'lodash';

const messages = defineMessages({
  heading: { id: 'column.moderation', defaultMessage: 'Moderation' },
  open_reports: { id: 'column.moderation.open_reports', defaultMessage: 'Open Reports' },
});

const mapStateToProps = state => {
  return {

  };
};

export default @connect(mapStateToProps)
@injectIntl
class Moderation extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
  }



  render() {
    const { intl } = this.props;

    return (
      <Column icon='gavel' heading={intl.formatMessage(messages.heading)} backBtnSlim>

      </Column>
    );
  }

}
