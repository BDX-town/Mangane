import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
} from 'gabsocial/features/forms';
import { patchMe } from 'gabsocial/actions/me';

const messages = defineMessages({
  heading: { id: 'column.edit_profile', defaultMessage: 'Edit profile' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class EditProfile extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: false };
  }

  getFormData = (form) => {
    return Object.fromEntries(
      new FormData(form).entries()
    );
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    const formData = this.getFormData(event.target);
    dispatch(patchMe(formData)).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  render() {
    const { account, intl } = this.props;

    return (
      <Column icon='users' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <TextInput
                label='Display name'
                name='display_name'
                defaultValue={account.get('display_name')}
              />
              <TextInput
                label='Bio'
                name='note'
                defaultValue={account.get('bio')}
              />
            </FieldsGroup>
          </fieldset>
          <div className='actions'>
            <button name='button' type='submit' className='btn button button-primary'>Save changes</button>
          </div>
        </SimpleForm>
      </Column>
    );
  }

}
