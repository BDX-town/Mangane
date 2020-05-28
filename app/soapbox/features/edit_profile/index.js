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
} from 'soapbox/features/forms';
import ProfilePreview from './components/profile_preview';
import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import { patchMe } from 'soapbox/actions/me';
import { unescape } from 'lodash';

const MAX_FIELDS = 4; // TODO: Make this dynamic by the instance

const messages = defineMessages({
  heading: { id: 'column.edit_profile', defaultMessage: 'Edit profile' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
  };
};

// Forces fields to be MAX_SIZE, filling empty values
const normalizeFields = fields => (
  ImmutableList(fields).setSize(MAX_FIELDS).map(field =>
    field ? field : ImmutableMap({ name: '', value: '' })
  )
);

// HTML unescape for special chars, eg <br>
const unescapeParams = (map, params) => (
  params.reduce((map, param) => (
    map.set(param, unescape(map.get(param)))
  ), map)
);

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
    fields: normalizeFields(Array.from({ length: MAX_FIELDS })),
  }

  makePreviewAccount = () => {
    const { account } = this.props;
    return account.merge(ImmutableMap({
      header: this.state.header,
      avatar: this.state.avatar,
      display_name: this.state.display_name,
    }));
  }

  getFieldParams = () => {
    let params = ImmutableMap();
    this.state.fields.forEach((f, i) =>
      params = params
        .set(`fields_attributes[${i}][name]`,  f.get('name'))
        .set(`fields_attributes[${i}][value]`, f.get('value'))
    );
    return params;
  }

  getParams = () => {
    const { state } = this;
    return Object.assign({
      discoverable: state.discoverable,
      bot: state.bot,
      display_name: state.display_name,
      note: state.note,
      avatar: state.avatar_file,
      header: state.header_file,
      locked: state.locked,
    }, this.getFieldParams().toJS());
  }

  getFormdata = () => {
    const data = this.getParams();
    let formData = new FormData();
    for (let key in data) {
      const shouldAppend = Boolean(data[key] || key.startsWith('fields_attributes'));
      if (shouldAppend) formData.append(key, data[key] || '');
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

  setInitialState = () => {
    const initialState = this.props.account.withMutations(map => {
      map.merge(map.get('source'));
      map.delete('source');
      map.set('fields', normalizeFields(map.get('fields')));
      unescapeParams(map, ['display_name', 'note']);
    });
    this.setState(initialState.toObject());
  }

  componentWillMount() {
    this.setInitialState();
  }

  handleCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFieldChange = (i, key) => {
    return (e) => {
      this.setState({
        fields: this.state.fields.setIn([i, key], e.target.value),
      });
    };
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
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <div className='input with_block_label'>
                  <label>Profile metadata</label>
                  <span className='hint'>You can have up to {MAX_FIELDS} items displayed as a table on your profile</span>
                  {
                    this.state.fields.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          placeholder='Label'
                          value={field.get('name')}
                          onChange={this.handleFieldChange(i, 'name')}
                        />
                        <TextInput
                          placeholder='Content'
                          value={field.get('value')}
                          onChange={this.handleFieldChange(i, 'value')}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
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
