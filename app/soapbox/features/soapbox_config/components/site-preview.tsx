import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { defaultSettings } from 'soapbox/actions/settings';
import BackgroundShapes from 'soapbox/features/ui/components/background_shapes';
import { useSystemTheme } from 'soapbox/hooks';
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

  const userTheme = settings.get('themeMode');
  const systemTheme = useSystemTheme();

  const dark = userTheme === 'dark' || (userTheme === 'system' && systemTheme === 'dark');

  const bodyClass = classNames(
    'site-preview',
    'relative flex justify-center align-center text-base',
    'border border-solid border-gray-200 dark:border-slate-600',
    'h-40 rounded-lg overflow-hidden',
    {
      'bg-white': !dark,
      'bg-slate-900': dark,
    });

  return (
    <div className={bodyClass}>
      <style>{`.site-preview {${generateThemeCss(soapboxConfig)}}`}</style>
      <BackgroundShapes position='absolute' />

      <div className='absolute p-2 rounded-lg overflow-hidden bg-accent-500 text-white self-center z-20'>
        <FormattedMessage id='site_preview.preview' defaultMessage='Preview' />
      </div>

      <div className={classNames('flex absolute inset-0 shadow z-10 h-12 lg:h-16', {
        'bg-white': !dark,
        'bg-slate-800': dark,
      })}
      >
        <img alt='Logo' className='h-5 lg:h-6 self-center px-2' src={soapboxConfig.logo} />
      </div>
    </div>
  );

};

export default SitePreview;
