import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

const DEFAULT_COLORS = ImmutableMap({
  gray: ImmutableMap({
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }),
  success: ImmutableMap({
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  }),
  danger: ImmutableMap({
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  }),
  'gradient-purple': '#b8a3f9',
  'gradient-blue': '#9bd5ff',
  'sea-blue': '#2feecc',
});

export const SoapboxConfigRecord = ImmutableRecord({
  logo: '',
  banner: '',
  brandColor: '', // Empty
  accentColor: '',
  colors: ImmutableMap(),
  copyright: `♥${new Date().getFullYear()}. Copying is an act of love. Please copy and share.`,
  customCss: ImmutableList<string>(),
  defaultSettings: ImmutableMap(),
  extensions: ImmutableMap(),
  greentext: false,
  promoPanel: ImmutableMap({
    items: ImmutableList(),
  }),
  navlinks: ImmutableMap({
    homeFooter: ImmutableList(),
  }),
  allowedEmoji: ImmutableList<string>([
    '👍',
    '❤️',
    '😆',
    '😮',
    '😢',
    '😩',
  ]),
  verifiedIcon: '',
  verifiedCanEditName: false,
  displayFqn: true,
  cryptoAddresses: ImmutableList<ImmutableMap<string, any>>(),
  cryptoDonatePanel: ImmutableMap({
    limit: 1,
  }),
  aboutPages: ImmutableMap(),
  betaPages: ImmutableMap(),
  mobilePages: ImmutableMap(),
  authenticatedProfile: true,
  singleUserMode: false,
  singleUserModeProfile: '',
}, 'SoapboxConfig');

type SoapboxConfigMap = ImmutableMap<string, any>;

const normalizeColors = (soapboxConfig: SoapboxConfigMap): SoapboxConfigMap => {
  const colors = DEFAULT_COLORS.mergeDeep(soapboxConfig.get('colors'));
  return soapboxConfig.set('colors', colors);
};

export const normalizeSoapboxConfig = (soapboxConfig: Record<string, any>) => {
  return SoapboxConfigRecord(
    ImmutableMap(fromJS(soapboxConfig)).withMutations(soapboxConfig => {
      normalizeColors(soapboxConfig);
    }),
  );
};
