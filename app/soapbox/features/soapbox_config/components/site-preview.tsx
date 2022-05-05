import classNames from 'classnames';
import React, { useMemo } from 'react';

import { defaultSettings } from 'soapbox/actions/settings';
import { normalizeSoapboxConfig } from 'soapbox/normalizers';
import { generateThemeCss } from 'soapbox/utils/theme';

interface ISitePreview {
  /** Raw Soapbox configuration. */
  soapbox: any,
}

/** Renders a preview of the website's style with the configuration applied. */
const SitePreview: React.FC<ISitePreview> = ({ soapbox }) => {
  const soapboxConfig = useMemo(() => normalizeSoapboxConfig(soapbox), [soapbox]);
  const settings = defaultSettings.mergeDeep(soapboxConfig.defaultSettings);

  const bodyClass = classNames('site-preview', `theme-mode-${settings.get('themeMode')}`, {
    'no-reduce-motion': !settings.get('reduceMotion'),
    'underline-links': settings.get('underlineLinks'),
    'dyslexic': settings.get('dyslexicFont'),
    'demetricator': settings.get('demetricator'),
  });

  return (
    <div className={bodyClass}>
      <style>{`.site-preview {${generateThemeCss(soapboxConfig)}}`}</style>
      <div className='app-holder'>
        <div>
          <div className='ui'>
            <nav className='tabs-bar'>
              <div className='tabs-bar__container'>
                <div className='tabs-bar__split tabs-bar__split--left'>
                  <a className='tabs-bar__link--logo' href='#'>
                    <img alt='Logo' src={soapboxConfig.logo} />
                    <span>Home</span>
                  </a>
                  <a className='tabs-bar__link' href='#'>
                    <i role='img' className='fa fa-home' />
                    <span>Home</span>
                  </a>
                  <a className='tabs-bar__link' href='#'>
                    <i role='img' className='fa fa-bell' />
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

};

export default SitePreview;
