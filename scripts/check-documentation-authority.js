#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { validateDocumentation } = require('./documentation-authority-lib');

const root = path.resolve(process.env.DOCUMENTATION_AUTHORITY_ROOT || path.resolve(__dirname, '..'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'config', 'documentation-authority-registry.json'), 'utf8'));
const requirements = JSON.parse(fs.readFileSync(path.join(root, 'config', 'historical-requirement-traceability.json'), 'utf8'));
const { errors, actual } = validateDocumentation({ root, registry, requirements });
if (errors.length) throw new Error(`documentation-authority:\n- ${errors.join('\n- ')}`);

process.stdout.write(`${JSON.stringify({
  documents: actual.documents.length,
  classifications: Object.fromEntries(
    [...new Set(actual.documents.map(record => record.classification))]
      .sort()
      .map(classification => [
        classification,
        actual.documents.filter(record => record.classification === classification).length,
      ]),
  ),
  historicalRequirements: requirements.requirements.length,
}, null, 2)}\n`);
