type MessageJson   = Record<string, string>;
type MessageModule = { default: MessageJson };

/** Import custom messages */
const importCustom = (locale: string): Promise<MessageModule> => {
  return import(/* webpackChunkName: "locale_[request]" */`custom/locales/${locale}.json`)
    .catch(() => ({ default: {} }));
};

/** Import git-checked messages */
const importMessages = (locale: string): Promise<MessageModule> => {
  return import(/* webpackChunkName: "locale_[request]" */`./${locale}.json`);
};

/** Override custom messages */
const importMessagesWithCustom = (locale: string): Promise<MessageJson> => {
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

const locales: string[] = [
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
  'is',
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

/** Soapbox locales map */
const messages = locales.reduce((acc, locale) => {
  acc[locale] = () => importMessagesWithCustom(locale);
  return acc;
}, {} as Record<string, () => Promise<MessageJson>>);

export default messages;
