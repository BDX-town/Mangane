import api from '../api';

export function createApp() {
  return (dispatch, getState) => {
    api(getState).post('/api/v1/apps', {
      client_name: `SoapboxFE_${(new Date()).toISOString()}`,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow push admin'
    }).then(response => {
      localStorage.setItem('app', JSON.stringify(response.data));
    });
  }
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    const app = JSON.parse(localStorage.getItem('app'));
    api(getState).post('/oauth/token', {
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'password',
      username: username,
      password: password
    }).then(response => {
      localStorage.setItem('user', JSON.stringify(response.data));
    });
  }
}
