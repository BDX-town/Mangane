import React, { useState, useCallback, useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { translateStatus } from 'soapbox/actions/statuses';
import Icon from 'soapbox/components/icon';
import { Button, Text, Spinner } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { translateText, shouldOfferTranslation } from 'soapbox/services/translation';
import { getFeatures } from 'soapbox/utils/features';
import { safeHtml } from 'soapbox/utils/html-safety';

import type { TranslationProvider } from 'soapbox/services/translation';
import type { Status as StatusEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  translate: { id: 'status.translate', defaultMessage: 'Translate' },
  translating: { id: 'status.translating', defaultMessage: 'Translating…' },
  translated: { id: 'status.translated', defaultMessage: 'Translated from {language}' },
  translatedVia: { id: 'status.translated_via', defaultMessage: 'Translated from {language} via {provider}' },
  showOriginal: { id: 'status.show_original', defaultMessage: 'Show original' },
  translationFailed: { id: 'status.translation_failed', defaultMessage: 'Translation failed. Try again.' },
  autoTranslated: { id: 'status.auto_translated', defaultMessage: 'Auto-translated from {language}' },
});

const providerNames: Record<TranslationProvider, string> = {
  server: 'Server',
  deepl: 'DeepL',
  libretranslate: 'LibreTranslate',
};

interface ITranslationBlock {
  /** The status to translate */
  status: StatusEntity;
  /** Whether this is a mini/inline version (for auto-translation in timelines) */
  mini?: boolean;
}

/**
 * Translation block component.
 * Renders below a status to offer or display translation.
 * Supports server-native, DeepL, and LibreTranslate backends.
 */
const TranslationBlock: React.FC<ITranslationBlock> = ({ status, mini = false }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const features = useAppSelector((state) => getFeatures(state.instance));

  const translationSettings = settings.get('translation') as any;
  const provider = translationSettings?.get('provider', 'server') as TranslationProvider;
  const targetLanguage = translationSettings?.get('targetLanguage', settings.get('locale')) as string;
  const autoTranslate = translationSettings?.get('autoTranslate', false) as boolean;
  const hideLanguages = React.useMemo(() =>
    (translationSettings?.get('hideLanguages')?.toJS?.() || []) as string[]
  , [translationSettings]);
  const deeplApiKey = translationSettings?.get('deeplApiKey', '') as string;
  const deeplPro = translationSettings?.get('deeplPro', false) as boolean;
  const libreTranslateUrl = translationSettings?.get('libreTranslateUrl', '') as string;
  const libreTranslateApiKey = translationSettings?.get('libreTranslateApiKey', '') as string;

  const postLanguage = status.language;
  const existingServerTranslation = status.translations?.get(targetLanguage);

  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<TranslationProvider | null>(null);
  const [uiState, setUIState] = useState<'default' | 'loading' | 'done' | 'error'>('default');
  const [showTranslation, setShowTranslation] = useState(true);
  const hasAutoTranslated = useRef(false);

  // Determine if we should offer translation
  const canTranslateServer = features.translations && provider === 'server';
  const canTranslateClient = (() => {
    if (provider === 'deepl') return !!deeplApiKey;
    if (provider === 'libretranslate') return !!libreTranslateUrl;
    return false;
  })();
  const canTranslate = canTranslateServer || canTranslateClient;

  const shouldOffer = shouldOfferTranslation(postLanguage, targetLanguage, hideLanguages);

  // Get language display name
  const getLanguageName = useCallback((code: string | null) => {
    if (!code) return null;
    try {
      return new Intl.DisplayNames([targetLanguage], { type: 'language' }).of(code);
    } catch {
      return code;
    }
  }, [targetLanguage]);

  const handleTranslate = useCallback(async() => {
    if (!status.content) return;

    setUIState('loading');

    try {
      if (provider === 'server') {
        // Use the existing Akkoma API
        await dispatch(translateStatus(status.id, targetLanguage));
        setUsedProvider('server');
        setDetectedLanguage(postLanguage);
        setUIState('done');
      } else {
        // Use client-side translation
        const result = await translateText(
          status.content,
          targetLanguage,
          postLanguage,
          {
            provider,
            deeplApiKey,
            deeplPro,
            libreTranslateUrl,
            libreTranslateApiKey,
            targetLanguage,
            autoTranslate,
            hideLanguages,
          },
        );

        if (result) {
          setTranslatedContent(result.content);
          setDetectedLanguage(result.detectedLanguage || postLanguage);
          setUsedProvider(result.provider);
          setUIState('done');
        }
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setUIState('error');
    }
  }, [status, provider, targetLanguage, postLanguage, dispatch, deeplApiKey, deeplPro, libreTranslateUrl, libreTranslateApiKey, autoTranslate, hideLanguages]);

  // Auto-translate on mount if enabled
  useEffect(() => {
    if (autoTranslate && shouldOffer && canTranslate && !hasAutoTranslated.current && uiState === 'default') {
      hasAutoTranslated.current = true;
      handleTranslate();
    }
  }, [autoTranslate, shouldOffer, canTranslate, handleTranslate, uiState]);

  // Don't render if translation isn't available or not needed
  if (!canTranslate || !shouldOffer) return null;

  // Determine what content to show
  const displayedTranslation = provider === 'server' ? existingServerTranslation : translatedContent;
  const isTranslated = uiState === 'done' || !!existingServerTranslation;
  const sourceLangName = getLanguageName(detectedLanguage || postLanguage);

  // Mini mode: just show translated text inline
  if (mini && isTranslated && displayedTranslation && showTranslation) {
    return (
      <div className='mt-2 rounded-md bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700 p-2.5'>
        <div className='flex items-center gap-1.5 mb-1.5'>
          <Icon src={require('@tabler/icons/language.svg')} className='h-3.5 w-3.5 text-gray-400' />
          <Text size='xs' theme='muted'>
            {intl.formatMessage(autoTranslate ? messages.autoTranslated : messages.translated, {
              language: sourceLangName || postLanguage,
            })}
          </Text>
          <button
            type='button'
            onClick={() => setShowTranslation(false)}
            className='ml-auto text-xs text-primary-600 dark:text-primary-400 hover:underline'
          >
            {intl.formatMessage(messages.showOriginal)}
          </button>
        </div>
        <div
          className='text-sm text-gray-800 dark:text-gray-200'
          lang={targetLanguage}
          dir='auto'
          dangerouslySetInnerHTML={safeHtml(displayedTranslation)}
        />
      </div>
    );
  }

  // Mini mode: collapsed state after hiding
  if (mini && isTranslated && !showTranslation) {
    return (
      <button
        type='button'
        onClick={() => setShowTranslation(true)}
        className='mt-1 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline'
      >
        <Icon src={require('@tabler/icons/language.svg')} className='h-3.5 w-3.5' />
        {intl.formatMessage(messages.translate)}
      </button>
    );
  }

  // Full mode
  return (
    <div className='mt-2'>
      {uiState === 'default' && (
        <Button
          theme='link'
          size='sm'
          onClick={handleTranslate}
          classNames='flex items-center gap-1'
        >
          <Icon src={require('@tabler/icons/language.svg')} className='h-4 w-4' />
          <span>
            {sourceLangName
              ? `${intl.formatMessage(messages.translate)} (${sourceLangName})`
              : intl.formatMessage(messages.translate)
            }
          </span>
        </Button>
      )}

      {uiState === 'loading' && (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Spinner size={16} withText={false} />
          <span>{intl.formatMessage(messages.translating)}</span>
        </div>
      )}

      {uiState === 'error' && (
        <div className='flex items-center gap-2'>
          <Text size='sm' theme='danger'>
            {intl.formatMessage(messages.translationFailed)}
          </Text>
          <Button theme='link' size='sm' onClick={handleTranslate}>
            {intl.formatMessage(messages.translate)}
          </Button>
        </div>
      )}

      {isTranslated && displayedTranslation && showTranslation && (
        <div className='mt-2 rounded-md bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700 p-3'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-1.5'>
              <Icon src={require('@tabler/icons/language.svg')} className='h-4 w-4 text-gray-400' />
              <Text size='xs' theme='muted'>
                {usedProvider && usedProvider !== 'server'
                  ? intl.formatMessage(messages.translatedVia, {
                    language: sourceLangName || postLanguage,
                    provider: providerNames[usedProvider],
                  })
                  : intl.formatMessage(messages.translated, {
                    language: sourceLangName || postLanguage,
                  })
                }
              </Text>
            </div>
            <button
              type='button'
              onClick={() => setShowTranslation(false)}
              className='text-xs text-primary-600 dark:text-primary-400 hover:underline'
            >
              {intl.formatMessage(messages.showOriginal)}
            </button>
          </div>
          <div
            className='status__content text-sm'
            lang={targetLanguage}
            dir='auto'
            dangerouslySetInnerHTML={safeHtml(displayedTranslation)}
          />
        </div>
      )}

      {isTranslated && !showTranslation && (
        <button
          type='button'
          onClick={() => setShowTranslation(true)}
          className='mt-1 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline'
        >
          <Icon src={require('@tabler/icons/language.svg')} className='h-3.5 w-3.5' />
          {intl.formatMessage(messages.translate)}
        </button>
      )}
    </div>
  );
};

export default TranslationBlock;
