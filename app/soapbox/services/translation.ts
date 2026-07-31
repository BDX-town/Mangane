/**
 * Translation service abstraction layer.
 * Supports multiple translation backends:
 * - Server-native (Akkoma's machine_translation API)
 * - DeepL API (free and pro)
 * - LibreTranslate (self-hosted or public instances)
 *
 * @module soapbox/services/translation
 */

export type TranslationProvider = 'server' | 'deepl' | 'libretranslate';

export interface TranslationResult {
  /** The translated text (may contain HTML) */
  content: string;
  /** The detected source language code, if available */
  detectedLanguage: string | null;
  /** The provider that performed the translation */
  provider: TranslationProvider;
}

export interface TranslationSettings {
  /** Which translation provider to use */
  provider: TranslationProvider;
  /** DeepL API key (free or pro) */
  deeplApiKey: string;
  /** Whether to use DeepL Pro endpoint (vs free) */
  deeplPro: boolean;
  /** LibreTranslate instance URL */
  libreTranslateUrl: string;
  /** LibreTranslate API key (optional for some instances) */
  libreTranslateApiKey: string;
  /** Target language for translations */
  targetLanguage: string;
  /** Whether to auto-translate posts in foreign languages */
  autoTranslate: boolean;
  /** Languages to never auto-translate (user probably reads them) */
  hideLanguages: string[];
}

const DEEPL_FREE_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_PRO_URL = 'https://api.deepl.com/v2/translate';

/**
 * Translate text using DeepL API.
 */
async function translateWithDeepL(
  text: string,
  targetLang: string,
  sourceLang: string | null,
  apiKey: string,
  usePro: boolean,
): Promise<TranslationResult> {
  const url = usePro ? DEEPL_PRO_URL : DEEPL_FREE_URL;

  const params: Record<string, string> = {
    text,
    target_lang: targetLang.toUpperCase().replace('-', '_'),
    auth_key: apiKey,
  };

  if (sourceLang) {
    params.source_lang = sourceLang.toUpperCase().split('-')[0];
  }

  // DeepL prefers form-encoded bodies
  const body = new URLSearchParams(params);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const translation = data.translations?.[0];

  if (!translation) {
    throw new Error('DeepL returned empty translation');
  }

  return {
    content: translation.text,
    detectedLanguage: translation.detected_source_language?.toLowerCase() || null,
    provider: 'deepl',
  };
}

/**
 * Translate text using LibreTranslate API.
 */
async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
  sourceLang: string | null,
  instanceUrl: string,
  apiKey: string,
): Promise<TranslationResult> {
  const url = `${instanceUrl.replace(/\/+$/, '')}/translate`;

  const body: Record<string, string> = {
    q: text,
    target: targetLang.split('-')[0],
    source: sourceLang?.split('-')[0] || 'auto',
    format: 'html',
  };

  if (apiKey) {
    body.api_key = apiKey;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LibreTranslate API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  return {
    content: data.translatedText,
    detectedLanguage: data.detectedLanguage?.language || null,
    provider: 'libretranslate',
  };
}

/**
 * Strip HTML tags to get plain text for translation APIs that don't support HTML.
 */
function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Main translation function. Routes to the appropriate backend based on settings.
 * For 'server' provider, returns null — the caller should use the existing
 * Akkoma translateStatus action instead.
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string | null,
  settings: TranslationSettings,
): Promise<TranslationResult | null> {
  const { provider } = settings;

  switch (provider) {
    case 'deepl': {
      if (!settings.deeplApiKey) {
        throw new Error('DeepL API key is not configured. Set it in Preferences → Translation.');
      }
      // DeepL handles HTML, but we strip it to avoid issues with partial tags
      const plainText = stripHtml(text);
      return translateWithDeepL(plainText, targetLang, sourceLang, settings.deeplApiKey, settings.deeplPro);
    }

    case 'libretranslate': {
      if (!settings.libreTranslateUrl) {
        throw new Error('LibreTranslate URL is not configured. Set it in Preferences → Translation.');
      }
      // LibreTranslate supports HTML format
      return translateWithLibreTranslate(text, targetLang, sourceLang, settings.libreTranslateUrl, settings.libreTranslateApiKey);
    }

    case 'server':
    default:
      // Server-native translation is handled by the existing translateStatus action
      return null;
  }
}

/**
 * Determine if a post should be offered translation.
 * Returns true if the post language differs from the user's target language
 * and is not in their "hide languages" list.
 */
export function shouldOfferTranslation(
  postLanguage: string | null,
  targetLanguage: string,
  hideLanguages: string[],
): boolean {
  if (!postLanguage) return false;

  const postLang = postLanguage.split('-')[0].toLowerCase();
  const targetLang = targetLanguage.split('-')[0].toLowerCase();

  // Same language — no translation needed
  if (postLang === targetLang) return false;

  // User has marked this language as one they read
  if (hideLanguages.some(lang => lang.split('-')[0].toLowerCase() === postLang)) {
    return false;
  }

  return true;
}
