import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LinkFooter from '../features/ui/components/link_footer';
import AdminNav from 'soapbox/features/admin/components/admin_nav';
import LatestAccountsPanel from 'soapbox/features/admin/components/latest_accounts_panel';

export default
class AdminPage extends ImmutablePureComponent {

  render() {
    const { children } = this.props;

    return (
      <div className='page page--admin'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <AdminNav />
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                <LatestAccountsPanel limit={5} />
                <LinkFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
