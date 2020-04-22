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
  Checkbox,
  FileChooser,
} from 'gabsocial/features/forms';
import ProfilePreview from './components/profile_preview';
import { Map as ImmutableMap } from 'immutable';
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

  state = {
    isLoading: false,
  }

  makePreviewAccount = () => {
    const { account } = this.props;
    return account.merge(ImmutableMap({
      header: this.state.header,
      avatar: this.state.avatar,
      display_name: this.state.display_name,
    }));
  }

  getParams = () => {
    const { state } = this;
    return {
      discoverable: state.discoverable,
      bot: state.bot,
      display_name: state.display_name,
      note: state.note,
      avatar: state.avatar_file,
      header: state.header_file,
      locked: state.locked,
      fields_attributes: state.fields_attributes,
    };
  }

  getFormdata = () => {
    const data = this.getParams();
    let formData = new FormData();
    for (let key in data) {
      if (data[key]) formData.append(key, data[key]);
    }
    return formData;
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    dispatch(patchMe(this.getFormdata())).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  componentWillMount() {
    const { account } = this.props;
    this.setState(account.toJS());
  }

  handleCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFileChange = e => {
    const { name } = e.target;
    const [file] = e.target.files || [];
    const url = file ? URL.createObjectURL(file) : this.state[name];

    this.setState({
      [name]: url,
      [`${name}_file`]: file,
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column icon='user' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <TextInput
                label='Display name'
                name='display_name'
                value={this.state.display_name}
                maxLength={30}
                size={30}
                onChange={this.handleTextChange}
              />
              <TextInput
                label='Bio'
                name='note'
                value={this.state.note}
                onChange={this.handleTextChange}
              />
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  <ProfilePreview account={this.makePreviewAccount()} />
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label='Header'
                    name='header'
                    hint='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 1500x500px'
                    onChange={this.handleFileChange}
                  />
                  <FileChooser
                    label='Avatar'
                    name='avatar'
                    hint='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 400x400px'
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
              <Checkbox
                label='Lock account'
                hint='Requires you to manually approve followers'
                name='locked'
                checked={this.state.locked}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label='This is a bot account'
                hint='This account mainly performs automated actions and might not be monitored'
                name='bot'
                checked={this.state.bot}
                onChange={this.handleCheckboxChange}
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
