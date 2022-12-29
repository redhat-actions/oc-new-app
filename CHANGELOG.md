# oc-new-app Changelog

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
