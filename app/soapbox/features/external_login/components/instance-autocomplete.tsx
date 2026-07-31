import classNames from 'classnames';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Avatar } from 'soapbox/components/ui';

import type { FediDBServer } from 'soapbox/api/fedidb';

const messages = defineMessages({
  placeholder: { id: 'instance_autocomplete.placeholder', defaultMessage: 'Enter your instance domain' },
  example: { id: 'instance_autocomplete.example', defaultMessage: 'e.g. "mastodon.social"' },
  noResults: { id: 'instance_autocomplete.no_results', defaultMessage: 'No matching instances found. You can still enter any domain.' },
  users: { id: 'instance_autocomplete.users', defaultMessage: '{count} users' },
  mau: { id: 'instance_autocomplete.mau', defaultMessage: '{count} active/mo' },
});

interface IInstanceAutocomplete {
  /** Current value of the input */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Called when user submits (selects) an instance */
  onSubmit: (instance: string) => void;
  /** List of servers to search through */
  servers: FediDBServer[];
  /** Whether the form is loading */
  isLoading?: boolean;
  /** Whether the servers data is still being fetched */
  isLoadingServers?: boolean;
}

/** Formats a number for display (e.g. 1200 -> "1.2K") */
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

/** Cleans up the input text to extract a potential domain */
const cleanInstanceText = (text: string): string => {
  return text
    .replace(/^https?:\/\//, '')   // Remove protocol
    .replace(/\/+$/, '')           // Remove trailing slash
    .replace(/^@?[^@]+@/, '')      // Remove @user@ prefix
    .trim()
    .toLowerCase();
};

/** Check if text looks like it could be a valid domain */
const looksLikeDomain = (text: string): boolean => {
  return /^[^\s/\\@]+\.[^\s/\\@]+$/.test(text);
};

/**
 * Phanpy-style instance autocomplete input.
 * Shows suggestions from FediDB as the user types, with fuzzy matching.
 */
const InstanceAutocomplete: React.FC<IInstanceAutocomplete> = ({
  value,
  onChange,
  onSubmit,
  servers,
  isLoading = false,
  isLoadingServers = false,
}) => {
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const cleaned = cleanInstanceText(value);
  const isDomain = looksLikeDomain(cleaned);

  // Fuzzy search through servers
  const suggestions = useMemo(() => {
    if (!cleaned) return [];
    return servers
      .filter(server => {
        const domain = server.domain.toLowerCase();
        const name = (server.software.name || '').toLowerCase();
        return domain.includes(cleaned) || name.includes(cleaned);
      })
      .slice(0, 8);
  }, [cleaned, servers]);

  // The instance to actually submit
  const selectedInstance = (() => {
    if (isDomain) return cleaned;
    if (suggestions.length > 0) return suggestions[0].domain;
    return cleaned || null;
  })();

  const showSuggestions = isFocused && cleaned.length > 0 && suggestions.length > 0;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setActiveIndex(-1);
  }, [onChange]);

  const handleSelectServer = useCallback((domain: string) => {
    onChange(domain);
    onSubmit(domain);
  }, [onChange, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedInstance) {
          onSubmit(selectedInstance);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelectServer(suggestions[activeIndex].domain);
        } else if (selectedInstance) {
          onSubmit(selectedInstance);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        break;
    }
  }, [showSuggestions, suggestions, activeIndex, selectedInstance, onSubmit, handleSelectServer]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current && !inputRef.current.contains(target) &&
        listRef.current && !listRef.current.contains(target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative w-full'>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={intl.formatMessage(messages.placeholder)}
          autoCorrect='off'
          autoCapitalize='off'
          autoComplete='off'
          spellCheck={false}
          disabled={isLoading}
          aria-label={intl.formatMessage(messages.placeholder)}
          aria-expanded={showSuggestions}
          aria-autocomplete='list'
          aria-controls='instance-suggestions'
          aria-activedescendant={activeIndex >= 0 ? `instance-option-${activeIndex}` : undefined}
          role='combobox'
          className={classNames(
            'dark:bg-slate-800 dark:text-white block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md',
            'focus:ring-primary-500 focus:border-primary-500',
            'px-4 py-3 text-base',
          )}
        />
        {isLoadingServers && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500' />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <ul
          ref={listRef}
          id='instance-suggestions'
          role='listbox'
          className={classNames(
            'absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-lg',
            'bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700',
          )}
        >
          {suggestions.map((server, index) => (
            <li
              key={server.domain}
              id={`instance-option-${index}`}
              role='option'
              aria-selected={activeIndex === index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectServer(server.domain);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={classNames(
                'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                {
                  'bg-primary-50 dark:bg-slate-700': activeIndex === index,
                  'hover:bg-gray-50 dark:hover:bg-slate-700': activeIndex !== index,
                },
              )}
            >
              {server.banner_url ? (
                <Avatar src={server.banner_url} size={32} />
              ) : (
                <div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-xs font-bold text-primary-600 dark:text-primary-300'>
                    {server.domain.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-sm text-gray-900 dark:text-white truncate'>
                    {server.domain}
                  </span>
                  <span className='inline-flex items-center rounded-full bg-gray-100 dark:bg-slate-600 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300'>
                    {server.software.name}
                  </span>
                </div>
                <div className='flex items-center gap-3 mt-0.5'>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {intl.formatMessage(messages.users, { count: formatCount(server.stats.user_count) })}
                  </span>
                  {server.stats.monthly_active_users > 0 && (
                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                      {intl.formatMessage(messages.mau, { count: formatCount(server.stats.monthly_active_users) })}
                    </span>
                  )}
                  {server.open_registration && (
                    <span className='text-xs text-green-600 dark:text-green-400'>
                      ✓ Open
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Helper text when no suggestions */}
      {isFocused && cleaned.length > 0 && suggestions.length === 0 && !isLoadingServers && (
        <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
          {isDomain
            ? null  // User has typed a valid domain, they can proceed
            : intl.formatMessage(messages.noResults)
          }
        </div>
      )}

      {/* Example hint when empty */}
      {!cleaned && isFocused && (
        <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
          {intl.formatMessage(messages.example)}
        </div>
      )}
    </div>
  );
};

export default InstanceAutocomplete;
