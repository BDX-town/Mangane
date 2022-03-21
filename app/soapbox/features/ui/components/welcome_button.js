import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { openComposeWithText } from 'soapbox/actions/compose';
import { Button } from 'soapbox/components/ui';
import emojify from 'soapbox/features/emoji/emoji';

const buildWelcomeMessage = account => (
  `Yo @${account.get('acct')} nice to have you on TRUTH!

Here's the lay of the land...

Got suggestions? Post a TRUTH (<- this is what we call a post) & tag the @suggestions account.

Come across a bug? Feel free to let us know by tagging the @Bug account in a TRUTH! Screenshots encouraged!

Also, if you want to just chat about the product... feel free to drop some 💥 TRUTH 💣 on me! Tag @Billy!

Finally, make sure to invite only your favorite peeps by hitting Invites in the sidebar.`
);

const messages = defineMessages({
  welcome: { id: 'account.welcome', defaultMessage: 'Welcome' },
});

const mapDispatchToProps = (dispatch) => ({
  onClick(account) {
    const text = buildWelcomeMessage(account);
    dispatch(openComposeWithText(text));
  },
});

export default @connect(undefined, mapDispatchToProps)
@injectIntl
class WelcomeButton extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = () => {
    this.props.onClick(this.props.account);
  }

  render() {
    const { intl } = this.props;

    return (
      <Button className='logo-button button--welcome' onClick={this.handleClick}>
        <div dangerouslySetInnerHTML={{ __html: emojify('👋') }} />
        {intl.formatMessage(messages.welcome)}
      </Button>
    );
  }

}
