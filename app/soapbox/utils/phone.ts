/** List of supported E164 country codes. */
const COUNTRY_CODES = [
  '1',
  '44',
] as const;

/** Supported E164 country code. */
type CountryCode = typeof COUNTRY_CODES[number];

/** Check whether a given value is a country code. */
const isCountryCode = (value: any): value is CountryCode => COUNTRY_CODES.includes(value);

function removeFormattingFromNumber(number = '') {
  if (number) {
    return number.toString().replace(/\D/g, '');
  }

  return number;
}

function formatPhoneNumber(countryCode: CountryCode, phoneNumber = '') {
  let formattedPhoneNumber = '';
  const strippedPhone = removeFormattingFromNumber(phoneNumber);

  for (let i = 0; i < strippedPhone.length && i < 10; i++) {
    const character = strippedPhone.charAt(i);
    if (i === 0) {
      const prefix = `+${countryCode} (`;
      formattedPhoneNumber += prefix + character;
    } else if (i === 3) {
      formattedPhoneNumber += `) ${character}`;
    } else if (i === 6) {
      formattedPhoneNumber += `-${character}`;
    } else {
      formattedPhoneNumber += character;
    }
  }
  return formattedPhoneNumber;
}

export {
  COUNTRY_CODES,
  CountryCode,
  isCountryCode,
  formatPhoneNumber,
};
