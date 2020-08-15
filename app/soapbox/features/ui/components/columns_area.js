import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default @(component => injectIntl(component, { withRef: true }))
class ColumnsArea extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    children: PropTypes.node,
    layout: PropTypes.object,
  };

  render() {
    const { children } = this.props;
    const layout = this.props.layout || { LEFT:null, RIGHT:null };

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              { layout.LEFT &&
                <div className='columns-area__panels__pane__inner'>
                  {layout.LEFT}
                </div>
              }
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              { layout.RIGHT &&
                <div className='columns-area__panels__pane__inner'>
                  {layout.RIGHT}
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    );
  }

}
