
function removeFormattingFromNumber(number = '') {
  if (number) {
    return number.toString().replace(/\D/g, '');
  }

  return number;
}

function formatPhoneNumber(phoneNumber = '') {
  let formattedPhoneNumber = '';
  let strippedPhone = removeFormattingFromNumber(phoneNumber);
  if (strippedPhone.slice(0, 1) === '1') {
    strippedPhone = strippedPhone.slice(1);
  }

  for (let i = 0; i < strippedPhone.length && i < 10; i++) {
    const character = strippedPhone.charAt(i);
    if (i === 0) {
      const prefix = '+1 (';
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

export { formatPhoneNumber };
