import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default class DefaultPage extends ImmutablePureComponent {

  render() {
    const { children } = this.props;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner' />
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner' />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
