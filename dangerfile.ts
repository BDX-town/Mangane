import { danger, warn } from 'danger';

// No PR is too small to include a description of why you made a change
if (danger.gitlab.mr.description.length < 10) {
  warn('Please include a description of your PR changes.');
}

// Check for a CHANGELOG entry
const hasChangelog = danger.git.modified_files.some(f => f === 'CHANGELOG.md');
const description = danger.gitlab.mr.description + danger.gitlab.mr.title;
const isTrivial = description.includes('#trivial');

if (!hasChangelog && !isTrivial) {
  warn('Please add a changelog entry for your changes.');
}
