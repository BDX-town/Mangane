'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.SHARE_TARGET_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'share-target-authority-inventory.json');
const fail = message => {
  throw new Error(`share-target-authority: ${message}`);
};

const expectedBindings = [
  'const MAX_DECLARED_FORM_BYTES=16*1024;',
  'const boundedText=(value,maxLength)=>typeof value===\'string\'?value.replace(/\\0/g,\'\').slice(0,maxLength):\'\';',
  'const handleShareRequest=async(request)=>{',
  'if(!ACCEPTED_CONTENT_TYPES.some(type=>contentType.toLowerCase().startsWith(type))){',
  'if(Number.isFinite(declaredLength)&&declaredLength>MAX_DECLARED_FORM_BYTES){',
  'const name=boundedText(formData.get(\'name\'),MAX_NAME_LENGTH);',
  'const description=boundedText(formData.get(\'description\'),MAX_DESCRIPTION_LENGTH);',
  'const link=boundedText(formData.get(\'link\'),MAX_LINK_LENGTH);',
  'const text=`${name}\\n${description}\\n\\n${link}`;',
  'const params=new URLSearchParams();',
  'params.append(\'text\',text);',
  'return Response.redirect(`/statuses/compose?${params.toString()}`,303);',
  'return new Response(\'\',{status:400});',
  'self.addEventListener(\'fetch\',(event)=>{',
  'requestUrl.origin===self.location.origin',
  'requestUrl.pathname===\'/share\'',
  'event.respondWith(handleShareRequest(event.request));',
];
const expectedUnknowns = [
  'Production service-worker bundling and manifest ownership for share_target.js remain incompletely enumerated.',
  'Browsers do not guarantee that Content-Length is exposed to service workers, so undeclared total multipart size remains platform-controlled even though accepted text fields and declared sizes are bounded.',
  'Redirect URL length is bounded indirectly by accepted field limits rather than by a separately measured deployment-proxy limit.',
  'Shared link scheme, preview-fetch behavior and downstream composer URL handling are not proven safe by this gate.',
  'File share fields and temporary storage are absent from the current text-only handler; any future addition requires quota and one-time cleanup reconciliation.',
  'FE_SUBDIRECTORY and production deployment rewrite behavior for the share-target redirect require end-to-end verification.',
];
const expectedDocumentationFragments = [
  'accepts only same-origin `POST /share` requests',
  'rejects declared payloads over 16 KiB',
  'Browsers do not guarantee that `Content-Length` is exposed',
  'must remain inert compose text',
  'Future file sharing requires a separate bounded storage contract',
];

const readInsideRoot = (relativePath, label) => {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe ${label} path ${relativePath}`);
  return fs.readFileSync(absolute, 'utf8');
};
const validateExactList = (actual, expected, label) => {
  if (!Array.isArray(actual) || actual.length !== expected.length || new Set(actual).size !== expected.length) {
    fail(`${label} changed without checker reconciliation`);
  }
  for (const item of expected) if (!actual.includes(item)) fail(`required ${label} item is missing: ${item}`);
};
const compactExecutable = source => {
  let output = '';
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (char === '/' && next === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end < 0) fail('unterminated block comment');
      i = end + 2;
      continue;
    }
    if (char === '"' || char === '\'' || char === '`') {
      const quote = char;
      output += char;
      i += 1;
      while (i < source.length) {
        output += source[i];
        if (source[i] === '\\') {
          i += 1;
          if (i < source.length) output += source[i];
        } else if (source[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    if (!/\s/.test(char)) output += char;
    i += 1;
  }
  return output;
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'phase-0g-hardened') fail('status changed without reconciliation');

const surface = manifest.surface;
if (!surface || surface.path !== 'app/soapbox/service_worker/share_target.js') fail('share-target surface changed without reconciliation');
validateExactList(surface.requiredExecutableBindings, expectedBindings, 'executable binding');
const workerSource = compactExecutable(readInsideRoot(surface.path, 'worker'));
for (const binding of expectedBindings) {
  const normalizedBinding = compactExecutable(binding);
  if (!workerSource.includes(normalizedBinding)) fail(`${surface.path} no longer contains executable share-target evidence: ${binding}`);
}

const registration = manifest.developmentRegistration;
if (!registration || registration.path !== 'app/soapbox/main.tsx') fail('development registration path changed without reconciliation');
const expectedRegistration = 'navigator.serviceWorker.register(\'/share_target.js\',{scope:\'/\',});';
if (registration.requiredExecutableBinding !== expectedRegistration) fail('development registration binding changed without reconciliation');
const registrationSource = compactExecutable(readInsideRoot(registration.path, 'registration'));
if (!registrationSource.includes(expectedRegistration)) fail(`${registration.path} no longer registers the expected share-target worker`);

const documentation = manifest.canonicalDocumentation;
if (!documentation || documentation.path !== 'docs/architecture/SHARE_TARGET_AUTHORITY_DRIFT_GATE.md') fail('canonical documentation path changed without reconciliation');
const documentationSource = readInsideRoot(documentation.path, 'documentation');
for (const fragment of expectedDocumentationFragments) {
  if (!documentationSource.includes(fragment)) fail(`${documentation.path} no longer contains required security evidence: ${fragment}`);
}

validateExactList(manifest.explicitUnknowns, expectedUnknowns, 'explicit unknown');
for (const invariant of [
  'routingRequiresExactSameOriginPath',
  'acceptedTextFieldsAreExplicitlyBounded',
  'declaredOversizeAndMalformedFormsFailClosed',
  'acceptedFieldsAreCurrentlyNameDescriptionAndLink',
  'redirectCurrentlyCarriesComposeTextInQueryString',
  'fileSharesRemainUnsupported',
]) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurface: surface.path,
  checkedExecutableBindings: expectedBindings.length,
  checkedDevelopmentRegistration: registration.path,
  checkedDocumentationFragments: expectedDocumentationFragments.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
