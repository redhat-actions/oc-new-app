# oc-new-app
[![CI checks](https://github.com/redhat-actions/oc-new-app/actions/workflows/ci-checks.yml/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions/workflows/ci-checks.yml)
[![OpenShift Pet Clinic Workflow](https://github.com/redhat-actions/oc-new-app/actions/workflows/example.yml/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions/workflows/example.yml)
[![Link checker](https://github.com/redhat-actions/oc-new-app/workflows/Link%20checker/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions?query=workflow%3A%22Link+checker%22)

[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/oc-new-app)](https://github.com/redhat-actions/buildah-build/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/oc-new-app)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/oc-new-app/dist/index.js)](./dist)

oc-new-app is a Github Action for deploying and exposing an application on Openshift.

## Action inputs

| Input | Description | Default |
| ----- | ----------- | ------- |
| app_name | Name to use for the generated application artifacts | **Must be provided** |
| image | The name (reference) of the image to create deployment | **Must be provided** |
| port | The port to use for the application | **Must be provided** |

## Action outputs

| Output | Description |
| ------ | ----------- |
| route | Service route of the deployed application |
| selector | Selector to filer out the deployment |

## Example

The example below shows how the `oc-new-app` action can be used to deploy and expose a
application on Openshift.

Before running this action, use [oc-login](https://github.com/redhat-actions/oc-login) to login into your Openshift cluster.

```yaml
- name: Create and expose app
  uses: redhat-actions/oc-new-app@v1
  with:
    app_name: ${{ env.APP_NAME }}
    port: ${{ env.APP_PORT }}
    image: ${{ env.IMAGE_PATH }}
```
To build and push the image to the desired registry, [buildah-build](https://github.com/redhat-actions/buildah-build)
and [push-to-registry](https://github.com/redhat-actions/push-to-registry) action can be used accordingly.

For a complete example see the [example workflow](.github/workflows/example.yml).

## Using private images

If your deployment requires private image, you have to `docker login` in a step before running this action.

For example:

```yaml
- name: Log in to Quay.io
  run: echo "${{ secrets.QUAY_IO_PASSWORD }}" | docker login quay.io -u "${{ secrets.QUAY_IO_USER }}" --password-stdin
```
