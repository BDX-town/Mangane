import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';

import BundleColumnError from '../components/bundle_column_error';
import ColumnForbidden from '../components/column_forbidden';
import ColumnLoading from '../components/column_loading';
import BundleContainer from '../containers/bundle_container';
import ColumnsAreaContainer from '../containers/columns_area_container';

const mapStateToProps = state => {
  const me = state.get('me');

  return {
    account: state.getIn(['accounts', me]),
    settings: getSettings(state),
  };
};

class WrappedRoute extends React.Component {

  static propTypes = {
    component: PropTypes.func.isRequired,
    page: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    content: PropTypes.node,
    componentParams: PropTypes.object,
    layout: PropTypes.object,
    account: ImmutablePropTypes.map,
    settings: ImmutablePropTypes.map.isRequired,
    publicRoute: PropTypes.bool,
    staffOnly: PropTypes.bool,
    adminOnly: PropTypes.bool,
    developerOnly: PropTypes.bool,
  };

  static defaultProps = {
    componentParams: {},
  };

  renderComponent = ({ match }) => {
    const { component, content, componentParams, layout, page: Page } = this.props;

    if (Page) {
      return (
        <BundleContainer fetchComponent={component} loading={this.renderLoading} error={this.renderError}>
          {Component =>
            (
              <Page params={match.params} layout={layout} {...componentParams}>
                <Component params={match.params} {...componentParams}>
                  {content}
                </Component>
              </Page>
            )
          }
        </BundleContainer>
      );
    }

    return (
      <BundleContainer fetchComponent={component} loading={this.renderLoading} error={this.renderError}>
        {Component =>
          (
            <ColumnsAreaContainer layout={layout}>
              <Component params={match.params} {...componentParams}>
                {content}
              </Component>
            </ColumnsAreaContainer>
          )
        }
      </BundleContainer>
    );
  }

  renderLoading = () => {
    return (
      <ColumnsAreaContainer layout={this.props.layout}>
        <ColumnLoading />
      </ColumnsAreaContainer>
    );
  }

  renderForbidden = () => {
    return (
      <ColumnsAreaContainer layout={this.props.layout}>
        <ColumnForbidden />
      </ColumnsAreaContainer>
    );
  }

  renderError = (props) => {
    return (
      <ColumnsAreaContainer layout={this.props.layout}>
        <BundleColumnError {...props} />
      </ColumnsAreaContainer>
    );
  }

  loginRedirect = () => {
    const actualUrl = encodeURIComponent(`${this.props.computedMatch.url}${this.props.location.search}`); // eslint-disable-line react/prop-types
    return <Redirect to={`/login?redirect_uri=${actualUrl}`} />;
  }

  render() {
    const { component: Component, content, account, settings, publicRoute, developerOnly, staffOnly, adminOnly, ...rest } = this.props;

    const authorized = [
      account || publicRoute,
      developerOnly ? settings.get('isDeveloper') : true,
      staffOnly ? account && isStaff(account) : true,
      adminOnly ? account && isAdmin(account) : true,
    ].every(c => c);

    if (!authorized) {
      if (!account) {
        return this.loginRedirect();
      } else {
        return this.renderForbidden();
      }
    }

    return <Route {...rest} render={this.renderComponent} />;
  }

}

const wrappedRoute = connect(mapStateToProps)(WrappedRoute);
export { wrappedRoute as WrappedRoute };
