'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

describe('routing inventory drift gate', () => {
  it('verifies the bounded routing evidence against current source', () => {
    const script = path.resolve(__dirname, 'check-routing-inventory.js');
    const output = execFileSync(process.execPath, [script], {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
    });

    const summary = JSON.parse(output);
    expect(summary).toMatchObject({
      schemaVersion: 1,
      status: 'verified-current-bounded',
      checkedSources: 7,
      developmentReservedPaths: 10,
      productionNavigationExclusions: 23,
      productionNavigationSuffixExclusions: 1,
      explicitUnknowns: 3,
    });
  });
});
