// @preval
const pkg = require('../../../package.json');

const shortRepoName = url => new URL(url).pathname.substring(1);

module.exports = {
  name: pkg.name,
  url: pkg.repository.url,
  repository: shortRepoName(pkg.repository.url),
  version: pkg.version,
};
