import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

const toSentence = (arr) => arr
  .reduce(
    (prev, curr, i) => prev + curr + (i === arr.length - 2 ? ' and ' : ', '),
    '',
  )
  .slice(0, -2);

const buildErrorMessage = (errors) => {
  const individualErrors = Object.keys(errors).map(
    (attribute) => `${startCase(camelCase(attribute))} ${toSentence(
      errors[attribute],
    )}`,
  );

  return toSentence(individualErrors);
};

export { buildErrorMessage };
