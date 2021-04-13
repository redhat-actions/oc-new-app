# oc-new-app
[![CI checks](https://github.com/redhat-actions/oc-new-app/actions/workflows/ci-checks.yml/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions/workflows/ci-checks.yml)
[![OpenShift Pet Clinic Workflow](https://github.com/redhat-actions/oc-new-app/actions/workflows/example.yml/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions/workflows/example.yml)
[![Link checker](https://github.com/redhat-actions/oc-new-app/workflows/Link%20checker/badge.svg)](https://github.com/redhat-actions/oc-new-app/actions?query=workflow%3A%22Link+checker%22)

[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/oc-new-app)](https://github.com/redhat-actions/buildah-build/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/oc-new-app)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/oc-new-app/dist/index.js)](./dist)

**oc-new-app** is a Github Action for deploying and exposing a single-container application on OpenShift.

This action wraps [`oc new-app`](https://docs.openshift.com/container-platform/4.6/applications/application_life_cycle_management/creating-applications-using-cli.html) to provide a simple interface for deploying an application.

It creates a Deployment which runs the application Pod, and then exposes that pod to the internet through a Service and a Route.

<a id="prerequisites"></a>

## Prerequisites

- An OpenShift Cluster is required. To try an OpenShift cluster, visit [try.openshift.com](https://try.openshift.com) or sign up for our [Developer Sandbox](https://developers.redhat.com/developer-sandbox).
- `oc` must be installed on the GitHub Action runner you specify.
    - Presently the [Ubuntu Environments](https://github.com/actions/virtual-environments#available-environments) come with `oc` 4.7.0 installed.
    - If you want a different version of `oc`, or if you are using the Mac or Windows environments, use the [**openshift-tools-installer**](https://github.com/redhat-actions/openshift-tools-installer) to install `oc` before running this action.
- You must log in to your OpenShift cluster, preferably by using [**oc-login**](https://github.com/redhat-actions/oc-login).

<a id="action-inputs"></a>

## Action inputs

| Input | Description | Default |
| ----- | ----------- | ------- |
| app_name | Name to use for the generated application artifacts | **Must be provided** |
| image | The fully qualified name of the application image | **Must be provided** |
| namespace | OpenShift project/Kubernetes namespace to target | Current context |
| port | The port to expose from the application container | **Must be provided** |

<a id="action-outputs"></a>

## Action outputs

| Output | Description |
| ------ | ----------- |
| route | URL to the application route |
| selector | Label selector of the created resources |

<a id="example"></a>

## Example

The example below shows how the **oc-new-app** action can be used to deploy and expose a
application on OpenShift.

```yaml
steps:
- name: Create and expose app
  uses: redhat-actions/oc-new-app@v1
  with:
    app_name: petclinic
    image: quay.io/diagrawa/petclinic:latest
    namespace: diagrawa-code
    port: 8080
```
To build and push the container image to a registry such as [quay.io](https://quay.io), use the [**buildah-build**](https://github.com/redhat-actions/buildah-build)
and [**push-to-registry**](https://github.com/redhat-actions/push-to-registry) actions.

For a complete example see the [example workflow](.github/workflows/example.yml).

## Troubleshooting

Note that [quay.io](https://quay.io) repositories are private by default.

This means that if you push an image for the first time, you will have to authenticate before pulling it, or go to the repository's settings and change its visibility.
