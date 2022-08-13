/** List of supported E164 country codes. */
const COUNTRY_CODES = [
  '1',
  '44',
] as const;

/** Supported E164 country code. */
type CountryCode = typeof COUNTRY_CODES[number];

/** Check whether a given value is a country code. */
const isCountryCode = (value: any): value is CountryCode => COUNTRY_CODES.includes(value);

export {
  COUNTRY_CODES,
  CountryCode,
  isCountryCode,
};
