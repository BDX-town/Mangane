import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import IconButton from 'soapbox/components/icon_button';
import { changeSetting, getSettings } from 'soapbox/actions/settings';


const messages = defineMessages({
  collapse: { id: 'explanation_box.collapse', defaultMessage: 'Collapse explanation box' },
  expand: { id: 'explanation_box.expand', defaultMessage: 'Expand explanation box' },
});

const mapStateToProps = state => {
  return {
    settings: getSettings(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleExplanationBox(setting) {
    dispatch(changeSetting(['explanationBox'], setting));
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ExplanationBox extends React.PureComponent {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    explanation: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    dismissable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    toggleExplanationBox: PropTypes.func,
  };

  handleToggleExplanationBox = () => {
    this.props.toggleExplanationBox(this.props.settings.get('explanationBox') === true ? false : true);
  }

  render() {
    const { title, explanation, dismissable, settings, intl } = this.props;

    return (
      <div className='explanation-box'>
        {title && <div className='explanation-box__title'>{title}
          <IconButton
            className='explanation_box__toggle' size={20}
            title={settings.get('explanationBox') ? intl.formatMessage(messages.collapse) : intl.formatMessage(messages.expand)}
            icon={settings.get('explanationBox') ? 'angle-down' : 'angle-up'}
            onClick={this.handleToggleExplanationBox}
          />
        </div>}
        {settings.get('explanationBox') &&
          <div className='explanation-box__explanation'>
            {explanation}
            {dismissable && <span className='explanation-box__dismiss'>Dismiss</span>}
          </div>
        }
      </div>
    );
  }

}
