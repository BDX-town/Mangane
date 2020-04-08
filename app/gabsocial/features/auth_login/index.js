import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createAuthApp, logIn } from 'gabsocial/actions/auth';
import { Redirect } from 'react-router-dom';
import { fetchMe } from 'gabsocial/actions/me';

const mapStateToProps = (state, props) => ({
  me: state.get('me'),
});

class LoginForm extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.state = {isLoading: false};
  }

  componentWillMount() {
    this.props.dispatch(createAuthApp());
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value])
    );
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    const { username, password } = this.getFormData(event.target);
    dispatch(logIn(username, password)).then(() => {
      return dispatch(fetchMe());
    }).catch(() => {
      // TODO: Handle bad request
      this.setState({isLoading: false});
    });
    this.setState({isLoading: true});
    event.preventDefault();
  }

  render() {
    const { me } = this.props;
    if (me) return <Redirect to='/' />;

    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <input name='username' placeholder='me@example.com' />
          <input name='password' type='password' placeholder='Password' />
          <input type='submit' value='Login' />
        </fieldset>
      </form>
    )
  }
}

export default connect(mapStateToProps)(LoginForm);
