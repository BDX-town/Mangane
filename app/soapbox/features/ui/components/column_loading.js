import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Column from 'soapbox/components/column';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ColumnHeader from '../../../components/column_header';

export default class ColumnLoading extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    icon: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    icon: '',
  };

  render() {
    const { title, icon } = this.props;
    return (
      <Column>
        <ColumnHeader icon={icon} title={title} focusable={false} />
        <div className='column-loading'>
          <LoadingIndicator />
        </div>
      </Column>
    );
  }

}
