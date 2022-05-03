import React from 'react';
import { Redirect, Route, useHistory, RouteProps, RouteComponentProps, match as MatchType } from 'react-router-dom';

import { Layout } from 'soapbox/components/ui';
import { useOwnAccount, useSettings } from 'soapbox/hooks';

import BundleColumnError from '../components/bundle_column_error';
import ColumnForbidden from '../components/column_forbidden';
import ColumnLoading from '../components/column_loading';
import ColumnsArea from '../components/columns_area';
import BundleContainer from '../containers/bundle_container';

type PageProps = {
  params?: MatchType['params'],
  layout?: any,
};

interface IWrappedRoute extends RouteProps {
  component: (...args: any[]) => any,
  page?: React.ComponentType<PageProps>,
  content?: React.ReactNode,
  componentParams?: Record<string, any>,
  layout?: any,
  publicRoute?: boolean,
  staffOnly?: boolean,
  adminOnly?: boolean,
  developerOnly?: boolean,
}

const WrappedRoute: React.FC<IWrappedRoute> = ({
  component,
  page: Page,
  content,
  componentParams = {},
  layout,
  publicRoute = false,
  staffOnly = false,
  adminOnly = false,
  developerOnly = false,
  ...rest
}) => {
  const history = useHistory();

  const account = useOwnAccount();
  const settings = useSettings();

  const renderComponent = ({ match }: RouteComponentProps) => {
    if (Page) {
      return (
        <BundleContainer fetchComponent={component} loading={renderLoading} error={renderError}>
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
      <BundleContainer fetchComponent={component} loading={renderLoading} error={renderError}>
        {Component =>
          (
            <ColumnsArea layout={layout}>
              <Component params={match.params} {...componentParams}>
                {content}
              </Component>
            </ColumnsArea>
          )
        }
      </BundleContainer>
    );
  };

  const renderWithLayout = (children: JSX.Element) => (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside />
    </>
  );

  const renderLoading   = () => renderWithLayout(<ColumnLoading />);
  const renderForbidden = () => renderWithLayout(<ColumnForbidden />);
  const renderError     = (props: any) => renderWithLayout(<BundleColumnError {...props} />);

  const loginRedirect = () => {
    const actualUrl = encodeURIComponent(`${history.location.pathname}${history.location.search}`);
    return <Redirect to={`/login?redirect_uri=${actualUrl}`} />;
  };

  const authorized = [
    account || publicRoute,
    developerOnly ? settings.get('isDeveloper') : true,
    staffOnly ? account && account.staff : true,
    adminOnly ? account && account.admin : true,
  ].every(c => c);

  if (!authorized) {
    if (!account) {
      return loginRedirect();
    } else {
      return renderForbidden();
    }
  }

  return <Route {...rest} render={renderComponent} />;
};

export {
  WrappedRoute,
};
