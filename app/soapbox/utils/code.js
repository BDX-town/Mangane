// @preval
const pkg = require('../../../package.json');
const { execSync } = require('child_process');

const shortRepoName = url => new URL(url).pathname.substring(1);

const version = pkg => {
  try {
    const head = String(execSync('git rev-parse HEAD'));
    const tag = String(execSync(`git rev-parse v${pkg.version}`));

    if (head !== tag) {
      return `${pkg.version}-${head.substring(0, 7)}`;
    } else {
      return pkg.version;
    }
  } catch (e) {
    return pkg.version;
  }
};

module.exports = {
  name: pkg.name,
  url: pkg.repository.url,
  repository: shortRepoName(pkg.repository.url),
  version: version(pkg),
};
