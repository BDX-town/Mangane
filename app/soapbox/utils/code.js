// @preval
const { execSync } = require('child_process');

const pkg = require('../../../package.json');

const shortRepoName = url => new URL(url).pathname.substring(1);
const trimHash = hash => hash.substring(0, 7);

const tryGit = cmd => {
  try {
    return String(execSync(cmd));
  } catch (e) {
    return null;
  }
};

const version = pkg => {
  // Try to discern from GitLab CI first
  const { CI_COMMIT_TAG, CI_COMMIT_REF_NAME, CI_COMMIT_SHA } = process.env;

  if (CI_COMMIT_TAG === `v${pkg.version}` || CI_COMMIT_REF_NAME === 'stable') {
    return pkg.version;
  }

  if (typeof CI_COMMIT_SHA === 'string') {
    return `${pkg.version}-${trimHash(CI_COMMIT_SHA)}`;
  }

  // Fall back to git directly
  const head = tryGit('git rev-parse HEAD');
  const tag = tryGit(`git rev-parse v${pkg.version}`);

  if (head && head !== tag) return `${pkg.version}-${trimHash(head)}`;

  // Fall back to version in package.json
  return pkg.version;
};

module.exports = {
  name: pkg.name,
  displayName: pkg.displayName,
  url: pkg.repository.url,
  repository: shortRepoName(pkg.repository.url),
  version: version(pkg),
  homepage: pkg.homepage,
};
