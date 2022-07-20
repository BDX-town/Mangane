# Contributing to Soapbox

Thank you for your interest in Soapbox!

When contributing to Soapbox, please first discuss the change you wish to make by [opening an issue](https://gitlab.com/soapbox-pub/soapbox-fe/-/issues).

## Opening an MR (merge request)

1. Smash that "fork" button on GitLab to make a copy of the repo.
2. Clone the repo locally, then begin work on a new branch (eg not `develop`).
3. Push your branch to your fork.
4. Once pushed, GitLab should provide you with a URL to open a new merge request right in your terminal. If not, do it [manually](https://gitlab.com/soapbox-pub/soapbox-fe/-/merge_requests/new).

### Ensuring the CI pipeline succeeds

When you push to a branch, the CI pipeline will run.

[Soapbox uses GitLab CI](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/.gitlab-ci.yml) to lint, run tests, and verify changes.
It's important this pipeline passes, otherwise we cannot merge the change.

New users of gitlab.com may see a "detatched pipeline" error.
If so, please check the following:

1. Your GitLab email address is confirmed.
2. You may have to have a credit card on file before the CI job will run.

## Text editor

We recommend developing Soapbox with [VSCodium](https://vscodium.com/) (or its proprietary ancestor, [VS Code](https://code.visualstudio.com/)).

This will help give you feedback about your changes _in the editor itself_ before GitLab CI performs linting, etc.

When this project is opened in Code it will automatically recommend extensions.
See [`.vscode/extensions.json`](https://gitlab.com/soapbox-pub/soapbox-fe/-/blob/develop/.vscode/extensions.json) for the full list.
