import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
class HomePage extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.composeBlock = React.createRef();
  }

  static defaultProps = {
    layout: { LEFT: null, RIGHT: null },
  }

  render() {
    const { me, children, account } = this.props;
    const LAYOUT = this.props.layout || this.defaultProps.layout;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                {LAYOUT.LEFT}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {me && <div className='timeline-compose-block' ref={this.composeBlock}>
                  <div className='timeline-compose-block__avatar'>
                    <Avatar account={account} size={46} />
                  </div>
                  <ComposeFormContainer
                    shouldCondense
                    autoFocus={false}
                    clickableAreaRef={this.composeBlock}
                  />
                </div>}

                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                {LAYOUT.RIGHT}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
