// Import custom messages
const importCustom = locale => {
  return import(/* webpackChunkName: "locale_[request]" */`custom/locales/${locale}.json`)
    .catch(error => ({ default: {} }));
};

// Import git-checked messages
const importMessages = locale => {
  return import(/* webpackChunkName: "locale_[request]" */`./${locale}.json`);
};

// Override custom messages
const importMessagesWithCustom = locale => {
  return Promise.all([
    importMessages(locale),
    importCustom(locale),
  ]).then(messages => {
    const [native, custom] = messages;
    return Object.assign(native.default, custom.default);
  }).catch(error => {
    console.error(error);
    throw error;
  });
};

const locales = [
  'ar',
  'ast',
  'bg',
  'bn',
  'br',
  'ca',
  'co',
  'cs',
  'cy',
  'da',
  'de',
  'el',
  'en',
  'en-Shaw',
  'eo',
  'es-AR',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fr',
  'ga',
  'gl',
  'he',
  'hi',
  'hr',
  'hu',
  'hy',
  'id',
  'io',
  'it',
  'ja',
  'ka',
  'kk',
  'ko',
  'lt',
  'lv',
  'mk',
  'ms',
  'nl',
  'nn',
  'no',
  'oc',
  'pl',
  'pt-BR',
  'pt',
  'ro',
  'ru',
  'sk',
  'sl',
  'sq',
  'sr',
  'sr-Latn',
  'sv',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'zh-CN',
  'zh-HK',
  'zh-TW',
];

// Build the export
const messages = locales.reduce((acc, locale) => {
  acc[locale] = () => importMessagesWithCustom(locale);
  return acc;
}, {});

export default messages;
