import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

import { Text } from '../../../components/ui';

const mapStateToProps = (state, props) => {
  const soapboxConfig = getSoapboxConfig(state);

  return {
    copyright: soapboxConfig.get('copyright'),
    navlinks: soapboxConfig.getIn(['navlinks', 'homeFooter'], ImmutableList()),
    locale: getSettings(state).get('locale'),
  };
};

export default @connect(mapStateToProps)
class Footer extends ImmutablePureComponent {

  static propTypes = {
    copyright: PropTypes.string,
    locale: PropTypes.string,
    navlinks: ImmutablePropTypes.list,
  }

  render() {
    const { copyright, locale, navlinks } = this.props;

    return (
      <footer className='relative max-w-7xl mt-auto mx-auto py-12 px-4 sm:px-6 xl:flex xl:items-center xl:justify-between lg:px-8'>
        <div className='flex flex-wrap justify-center'>
          {navlinks.map((link, idx) => {
            const url = link.get('url');
            const isExternal = url.startsWith('http');
            const Comp = isExternal ? 'a' : Link;
            const compProps = isExternal ? { href: url, target: '_blank' } : { to: url };

            return (
              <div key={idx} className='px-5 py-2'>
                <Comp {...compProps} className='hover:underline'>
                  <Text tag='span' theme='primary' size='sm'>
                    {link.getIn(['titleLocales', locale]) || link.get('title')}
                  </Text>
                </Comp>
              </div>
            );
          })}
        </div>

        <div className='mt-6 xl:mt-0'>
          <Text theme='muted' align='center' size='sm'>{copyright}</Text>
        </div>
      </footer>
    );
  }

}
