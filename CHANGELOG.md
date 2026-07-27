# oc-new-app Changelog

## v2.0
### Breaking Changes
- Update action runtime from Node20 to Node24.
- Upgrade `@actions/core` from v1 to v3 and `@actions/exec` from v1 to v3.

### Features
- Add new `env` input for setting runtime environment variables on deployed containers. The existing `build_env` input only applies to S2I builds. (#33)

### Bug Fixes
- Fix race condition where route host was not yet populated, resulting in the output showing `http://` with no hostname. `getRoute()` now retries up to 10 times with 3-second delays. (#13)
- Fix unused variable in `checkPullSecretWithLabel`.
- Clarify `build_env` description to state it applies to S2I builds only. (#33)

### Dependencies
- Upgrade TypeScript from 5.4 to 6.0.
- Upgrade `@vercel/ncc` from 0.38 to 0.44.
- Migrate from ESLint 8 (legacy `.eslintrc.js` with `@redhat-actions/eslint-config`) to ESLint 10 with flat config (`eslint.config.mjs`).
- Replace shared `@redhat-actions/tsconfig` (targeting Node 12/es2019) with inline config targeting es2024/nodenext.
- Resolve all 16 npm audit vulnerabilities.

### CI & Infrastructure
- Upgrade `actions/checkout` from v4 to v7.
- Upgrade `actions/setup-node` from v2 to v7.
- Migrate from deprecated `nick-invision/retry` to `nick-fields/retry` v4.
- Upgrade `redhat-actions/common` from v1 to v2, `oc-login` v1 to v2, `podman-login` v1 to v2, `openshift-tools-installer` v1 to v2.
- Update `runs-on` from `ubuntu-22.04` to `ubuntu-24.04`.
- Add `permissions: contents: read` to all workflows.
- Add concurrency groups and path filters to CI workflows.
- Remove obsolete CRDA vulnerability scan workflow (CRDA discontinued).
- Remove unmaintained Pet Clinic example workflows.

### Security
- Enable secret scanning and push protection.
- Set default workflow permissions to read-only.
- Add Dependabot for npm and GitHub Actions dependency updates.
- Add CODEOWNERS, SECURITY.md.

## v1.4
- Update action to run on Node20. https://github.blog/changelog/2023-09-22-github-actions-transitioning-from-node-16-to-node-20/

## v1.3
- Update action to run on Node16. https://github.blog/changelog/2022-05-20-actions-can-now-run-in-a-node-js-16-runtime/

## v1.2.3
- Fix podman auth file issue while creating secrets

## v1.2.2
- Fix openshift.com/try link that is now a 404

## v1.2.1
- Add label in the `oc new-app` command to add labels in the all the created resources

## v1.2
- Add support to use Image streams to deploy application.
- Add input `build_env` to pass environment variables to the build container at the run time.

## v1.1
- Add support to use private images for deployment
- Make input `port` optional

## v1.0.1
Update README to point to podman-login action

## v1
Initial Release
