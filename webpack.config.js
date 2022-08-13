require('dotenv').config();

const { NODE_ENV } = process.env;

switch (NODE_ENV) {
  case 'development':
  case 'production':
  case 'test':
    module.exports = require(`./webpack/${NODE_ENV}`); break;
  default:
    console.error('ERROR: NODE_ENV must be set to either `development`, `test`, or `production`.');
    process.exit(1);
}
