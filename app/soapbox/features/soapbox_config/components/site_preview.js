import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import { defaultSettings } from 'soapbox/actions/settings';
import { brandColorToCSS } from 'soapbox/utils/theme';

export default function SitePreview({ soapbox }) {

  const settings = defaultSettings.mergeDeep(soapbox.get('defaultSettings'));

  const bodyClass = classNames('site-preview app-body', `theme-mode-${settings.get('themeMode')}`, {
    'system-font': settings.get('systemFont'),
    'no-reduce-motion': !settings.get('reduceMotion'),
    'underline-links': settings.get('underlineLinks'),
    'dyslexic': settings.get('dyslexicFont'),
    'demetricator': settings.get('demetricator'),
    'halloween': settings.get('halloween'),
  });

  return (
    <div className={bodyClass}>
      <style>{`.site-preview {${brandColorToCSS(soapbox.get('brandColor'))}}`}</style>
      <div className='app-holder'>
        <div>
          <div className='ui'>
            <nav className='tabs-bar'>
              <div className='tabs-bar__container'>
                <div className='tabs-bar__split tabs-bar__split--left'>
                  <a className='tabs-bar__link--logo' href='#'>
                    <img alt='Logo' src={soapbox.get('logo')} />
                    <span>Home</span>
                  </a>
                  <a className='tabs-bar__link' href='#'>
                    <i role='img' alt='home' className='fa fa-home' />
                    <span>Home</span>
                  </a>
                  <a className='tabs-bar__link' href='#'>
                    <i role='img' alt='bell' className='fa fa-bell' />
                    <span>Notifications</span>
                  </a>
                </div>
              </div>
            </nav>
            <div className='page'>
              <span className='spoiler-button__overlay__label'>Site Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

SitePreview.propTypes = {
  soapbox: ImmutablePropTypes.map.isRequired,
};
