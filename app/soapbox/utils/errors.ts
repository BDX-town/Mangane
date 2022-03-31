import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

const toSentence = (arr: string[]) => arr
  .reduce(
    (prev, curr, i) => prev + curr + (i === arr.length - 2 ? ' and ' : ', '),
    '',
  )
  .slice(0, -2);

type Errors = {
  [key: string]: string[]
}

const buildErrorMessage = (errors: Errors) => {
  const individualErrors = Object.keys(errors).map(
    (attribute) => `${startCase(camelCase(attribute))} ${toSentence(
      errors[attribute],
    )}`,
  );

  return toSentence(individualErrors);
};

const httpErrorMessages: { code: number, name: string, description: string }[] = [
  {
    code: 100,
    name: 'Continue',
    description: 'The server has received the request headers, and the client should proceed to send the request body',
  },
  {
    code: 101,
    name: 'Switching Protocols',
    description: 'The requester has asked the server to switch protocols',
  },
  {
    code: 103,
    name: 'Checkpoint',
    description: 'Used in the resumable requests proposal to resume aborted PUT or POST requests',
  },
  {
    code: 200,
    name: 'OK',
    description: 'The request is OK (this is the standard response for successful HTTP requests)',
  },
  {
    code: 201,
    name: 'Created',
    description: 'The request has been fulfilled',
  },
  {
    code: 202,
    name: 'Accepted',
    description: 'The request has been accepted for processing',
  },
  {
    code: 203,
    name: 'Non-Authoritative Information',
    description: 'The request has been successfully processed',
  },
  {
    code: 204,
    name: 'No Content',
    description: 'The request has been successfully processed',
  },
  {
    code: 205,
    name: 'Reset Content',
    description: 'The request has been successfully processed',
  },
  {
    code: 206,
    name: 'Partial Content',
    description: 'The server is delivering only part of the resource due to a range header sent by the client',
  },
  {
    code: 400,
    name: 'Bad Request',
    description: 'The request cannot be fulfilled due to bad syntax',
  },
  {
    code: 401,
    name: 'Unauthorized',
    description: 'The request was a legal request',
  },
  {
    code: 402,
    name: 'Payment Required',
    description: 'Reserved for future use',
  },
  {
    code: 403,
    name: 'Forbidden',
    description: 'The request was a legal request',
  },
  {
    code: 404,
    name: 'Not Found',
    description: 'The requested page could not be found but may be available again in the future',
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    description: 'A request was made of a page using a request method not supported by that page',
  },
  {
    code: 406,
    name: 'Not Acceptable',
    description: 'The server can only generate a response that is not accepted by the client',
  },
  {
    code: 407,
    name: 'Proxy Authentication Required',
    description: 'The client must first authenticate itself with the proxy',
  },
  {
    code: 408,
    name: 'Request',
    description: ' Timeout\tThe server timed out waiting for the request',
  },
  {
    code: 409,
    name: 'Conflict',
    description: 'The request could not be completed because of a conflict in the request',
  },
  {
    code: 410,
    name: 'Gone',
    description: 'The requested page is no longer available',
  },
  {
    code: 411,
    name: 'Length Required',
    description: 'The "Content-Length" is not defined. The server will not accept the request without it',
  },
  {
    code: 412,
    name: 'Precondition',
    description: ' Failed. The precondition given in the request evaluated to false by the server',
  },
  {
    code: 413,
    name: 'Request Entity Too Large',
    description: 'The server will not accept the request',
  },
  {
    code: 414,
    name: 'Request-URI Too Long',
    description: 'The server will not accept the request',
  },
  {
    code: 415,
    name: 'Unsupported Media Type',
    description: 'The server will not accept the request',
  },
  {
    code: 416,
    name: 'Requested Range Not Satisfiable',
    description: 'The client has asked for a portion of the file',
  },
  {
    code: 417,
    name: 'Expectation Failed',
    description: 'The server cannot meet the requirements of the Expect request-header field',
  },
  {
    code: 500,
    name: 'Internal Server Error',
    description: 'An unexpected error occurred',
  },
  {
    code: 501,
    name: 'Not Implemented',
    description: 'The server either does not recognize the request method',
  },
  {
    code: 502,
    name: 'Bad Gateway',
    description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server',
  },
  {
    code: 503,
    name: 'Service Unavailable',
    description: 'The server is currently unavailable (overloaded or down)',
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server',
  },
  {
    code: 505,
    name: 'HTTP Version Not Supported',
    description: 'The server does not support the HTTP protocol version used in the request',
  },
  {
    code: 511,
    name: 'Network Authentication Required',
    description: 'The client needs to auth',
  },
];

export { buildErrorMessage, httpErrorMessages };
