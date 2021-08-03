import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { fetchCaptcha } from 'soapbox/actions/auth';
import { TextInput } from 'soapbox/features/forms';
import { FormattedMessage } from 'react-intl';

const noOp = () => {};

export default @connect()
class CaptchaField extends React.Component {

  static propTypes = {
    onChange: PropTypes.func,
    onFetch: PropTypes.func,
    onFetchFail: PropTypes.func,
    onClick: PropTypes.func,
    dispatch: PropTypes.func,
    refreshInterval: PropTypes.number,
    idempotencyKey: PropTypes.string,
  }

  static defaultProps = {
    onChange: noOp,
    onFetch: noOp,
    onFetchFail: noOp,
    onClick: noOp,
    refreshInterval: 5*60*1000, // 5 minutes, Pleroma default
  }

  state = {
    captcha: ImmutableMap(),
    refresh: undefined,
  }

  startRefresh = () => {
    const { refreshInterval } = this.props;
    if (refreshInterval) {
      const refresh = setInterval(this.fetchCaptcha, refreshInterval);
      this.setState({ refresh });
    }
  }

  endRefresh = () => {
    clearInterval(this.state.refresh);
  }

  forceRefresh = () => {
    this.fetchCaptcha();
    this.endRefresh();
    this.startRefresh();
  }

  fetchCaptcha = () => {
    const { dispatch, onFetch, onFetchFail } = this.props;
    dispatch(fetchCaptcha()).then(response => {
      const captcha = ImmutableMap(response.data);
      this.setState({ captcha });
      onFetch(captcha);
    }).catch(error => {
      onFetchFail(error);
    });
  }

  componentDidMount() {
    this.fetchCaptcha();
    this.startRefresh(); // Refresh periodically
  }

  componentWillUnmount() {
    this.endRefresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.idempotencyKey !== prevProps.idempotencyKey) {
      this.forceRefresh();
    }
  }

  render() {
    const { captcha } = this.state;
    const { onChange, onClick, ...props } = this.props;

    switch(captcha.get('type')) {
    case 'native':
      return (
        <div>
          <p>{<FormattedMessage id='registration.captcha.hint' defaultMessage='Click the image to get a new captcha' />}</p>
          <NativeCaptchaField captcha={captcha} onChange={onChange} onClick={onClick} {...props} />
        </div>
      );
    case 'none':
    default:
      return null;
    }
  }

}

export const NativeCaptchaField = ({ captcha, onChange, onClick, name, value }) => (
  <div className='captcha' >
    <img alt='captcha' src={captcha.get('url')} onClick={onClick} />
    <TextInput
      placeholder='Enter the pictured text'
      name={name}
      value={value}
      autoComplete='off'
      onChange={onChange}
      required
    />
  </div>
);

NativeCaptchaField.propTypes = {
  captcha: ImmutablePropTypes.map.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
};
