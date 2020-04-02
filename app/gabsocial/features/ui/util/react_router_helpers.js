import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import ColumnsAreaContainer from '../containers/columns_area_container';
import ColumnLoading from '../components/column_loading';
import BundleColumnError from '../components/bundle_column_error';
import BundleContainer from '../containers/bundle_container';

const mapStateToProps = state => {
  return {
    me: state.get('me'),
  };
};

class WrappedRoute extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    page: PropTypes.func,
    content: PropTypes.node,
    componentParams: PropTypes.object,
    layout: PropTypes.object,
    publicRoute: PropTypes.bool,
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
                <Page params={match.params} {...componentParams}>
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
    return <ColumnLoading />;
  }

  renderError = (props) => {
    return <BundleColumnError {...props} />;
  }

  render () {
    const { component: Component, content, publicRoute, me, ...rest } = this.props;

    if (!publicRoute && me == false) {
      const actualUrl = encodeURIComponent(this.props.computedMatch.url);
      return <Route path={this.props.path} component={() => {
         window.location.href = `/auth/sign_in?redirect_uri=${actualUrl}`;
         return null;
       }}/>
    }

    return <Route {...rest} render={this.renderComponent} />;
  }
}

const wrappedRoute = connect(mapStateToProps)(WrappedRoute);
export {wrappedRoute as WrappedRoute};
