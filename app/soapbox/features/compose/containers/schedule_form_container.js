import React from 'react';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { ScheduleForm } from 'soapbox/features/ui/util/async-components';

export default class ScheduleFormContainer extends React.PureComponent {

  render() {
    return (
      <BundleContainer fetchComponent={ScheduleForm}>
        {Component => <Component {...this.props} />}
      </BundleContainer>
    );
  }

}
