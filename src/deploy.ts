/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as ghCore from "@actions/core";
import Oc from "./oc";

namespace Deploy {

    const secretLabel = "app.kubernetes.io/managed-by=oc-new-app-action";

    /**
     * Creates new app with the image provided
     * @param appName Name of the app to use in 'oc new-app' command
     * @param image Image to create application from
     * @param namespace Namespace in which to create new app
     */
    export async function newApp(appName: string, image: string, namespaceArg?: string): Promise<void> {
        ghCore.info("⏳ Creating Deployment from image of the application...");
        const ocOptions = Oc.getOptions({ name: appName, "docker-image": image });
        const ocExecArgs = [ Oc.Commands.NewApp, ...ocOptions ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        await Oc.exec(ocExecArgs);
    }

    /**
     * Take down any old deployment
     * @param appSelector Selector to filter out deployment
     * @param namespace Namespace from which to delete deployment
     */
    export async function deleteDeployment(appSelector: string, namespaceArg?: string): Promise<void> {
        ghCore.info("🔎 Checking for old deployments and deleting if found...");
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Delete, Oc.SubCommands.All, ...ocOptions ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        await Oc.exec(ocExecArgs);
    }

    /**
     * Patch the created service with the port to expose
     * @param appName Name of the app for which to patch the service
     * @param port Port to expose
     * @param namespace Namespace where service is created
     */
    export async function patchSvc(appName: string, port: string, namespaceArg?: string): Promise<void> {
        ghCore.info(`⏳ Patching service with the port "${port}" ...`);
        const portInt = Number(port);
        const patchJson = {
            spec: {
                ports: [
                    {
                        name: `${portInt}-tcp`,
                        port: portInt,
                    },
                ],
            },
        };
        const patchJsonString = JSON.stringify(patchJson);
        const ocOptions = Oc.getOptions({ patch: patchJsonString });
        const ocExecArgs = [ Oc.Commands.Patch, Oc.SubCommands.Service, appName, ...ocOptions ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        await Oc.exec(ocExecArgs);
    }

    /**
     * Expose the route of the application service
     * @param appName Name of the app for which to expose the route
     * @param svcPort Port to expose
     * @param namespace Namespace where created app exists
     */
    export async function exposeSvc(appName: string, svcPort: string, namespaceArg?: string): Promise<void> {
        ghCore.info(`Exposing the route for "${appName}" service...`);
        const ocOptions = Oc.getOptions({ port: svcPort });
        const ocExecArgs = [ Oc.Commands.Expose, Oc.SubCommands.Service, appName, ...ocOptions ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        await Oc.exec(ocExecArgs);
    }

    /**
     * Get all the deployments based on the selector filter
     * @param appSelector Selector to filter out the deployment
     * @param namespace Namespace in which to get the deployment
     */
    export async function getDeployment(appSelector: string, namespaceArg?: string): Promise<void> {
        ghCore.info("⏳ Verifying if deployment is created successfully...");
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Get, Oc.SubCommands.All, ...ocOptions ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        await Oc.exec(ocExecArgs);
    }

    /**
     * Get route of the exposed service of the application
     * @param appName Name of the app for which to find the route
     * @param namespace Namespace in which created app exists
     */
    export async function getRoute(appName: string, namespaceArg?: string): Promise<string> {
        ghCore.info(`⏳ Fetching route of the "${appName}" application...`);
        const jsonPath = "{.spec.host}";
        const outputOcOptions = Oc.getOptions({ output: "" });
        const ocExecArgs = [
            // add new line to 'oc get route' command output
            Oc.Commands.Get, Oc.SubCommands.Route, appName, ...outputOcOptions, `jsonpath=${jsonPath}{"\\n"}`,
        ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }

        const execResult = await Oc.exec(ocExecArgs);
        return execResult.out.trim();
    }

    export async function createPullSecretFromFile(
        pullSecretName: string, authFilePath: string, namespaceArg?: string
    ): Promise<void> {
        // check if pull secret exists or not
        if (await isPullSecretExists(pullSecretName, namespaceArg)) {
            ghCore.info(`ℹ️ Secret "${pullSecretName}" already present, using this secret`);
            return;
        }

        ghCore.info(`⏳ Secret doesn't exist. Creating pull secret using auth file present at ${authFilePath}.`);
        const ocOptions = Oc.getOptions({
            "from-file": `.dockerconfigjson=${authFilePath}`, type: "kubernetes.io/dockerconfigjson",
        });
        const ocExecArgs = [
            Oc.Commands.Create, Oc.SubCommands.Secret, "generic", pullSecretName, ...ocOptions,
        ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }

        await Oc.exec(ocExecArgs);

        // Add label to uniquely identify this secret
        await addLabelToSecret(pullSecretName, namespaceArg);
    }

    export async function createPullSecretFromCreds(
        pullSecretName: string, registryServer: string, registryUsername: string,
        registryPassword: string, namespaceArg?: string
    ): Promise<void> {
        // check if pull secret exists or not
        if (await isPullSecretExists(pullSecretName, namespaceArg)) {
            ghCore.info(`ℹ️ Secret $"{pullSecretName}" already present, using this secret`);
            return;
        }

        ghCore.info(`⏳ Secret doesn't exist. Creating pull secret using provided image registry credentials...`);
        const ocOptions = Oc.getOptions({
            "docker-server": registryServer, "docker-username": registryUsername, "docker-password": registryPassword,
        });
        const ocExecArgs = [
            Oc.Commands.Create, Oc.SubCommands.Secret, "docker-registry", pullSecretName, ...ocOptions,
        ];

        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }

        await Oc.exec(ocExecArgs);

        await addLabelToSecret(pullSecretName, namespaceArg);
    }

    export async function linkSecretToServiceAccount(pullSecretName: string, namespaceArg?: string): Promise<void> {
        const defaultServiceAccount = "default";
        ghCore.info(`🔗 Linking secret "${pullSecretName}" to the service account "${defaultServiceAccount}"...`);
        const ocOptions = Oc.getOptions({ for: "pull" });
        const ocExecArgs = [
            Oc.Commands.Secrets, Oc.SubCommands.Link, defaultServiceAccount, pullSecretName, ...ocOptions,
        ];

        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }

        await Oc.exec(ocExecArgs);
    }

    async function addLabelToSecret(pullSecretName: string, namespaceArg?: string): Promise<void> {
        ghCore.info(`Adding label "${secretLabel}" to secret "${pullSecretName}"`);
        const ocExecArgs = [
            Oc.Commands.Label, Oc.SubCommands.Secret, pullSecretName, secretLabel,
        ];

        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }

        await Oc.exec(ocExecArgs);
    }

    export async function isPullSecretExists(pullSecretName: string, namespaceArg?: string): Promise<boolean> {
        ghCore.info(`🔎 Checking if secret "${pullSecretName}" exists`);
        const ocExecArgs = [
            Oc.Commands.Get, Oc.SubCommands.Secret, pullSecretName,
        ];
        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        try {
            await Oc.exec(ocExecArgs, { group: true });
            return true;
        }
        catch (error) {
            ghCore.debug(error);
        }

        return false;
    }

    async function checkPullSecretWithLabel(pullSecretName: string, namespaceArg?: string): Promise<boolean> {
        ghCore.info(`🔎 Checking if secret "${pullSecretName}" with label "${secretLabel}" exists`);
        const jsonPath = "{.items[*].metadata.name}";
        const ocOptions = Oc.getOptions({ selector: secretLabel, output: "" });

        const ocExecArgs = [
            Oc.Commands.Get, Oc.SubCommands.Secret, ...ocOptions, `jsonpath=${jsonPath}{"\\n"}`,
        ];

        if (namespaceArg) {
            ocExecArgs.push(namespaceArg);
        }
        const execResult = await Oc.exec(ocExecArgs);

        const secretsList = execResult.out.trim().split(" ");

        for (const secret of secretsList) {
            if (secret === pullSecretName) {
                return true;
            }
        }

        return false;
    }

    export async function deletePullSecretWithLabel(pullSecretName: string, namespaceArg?: string): Promise<void> {
        if (await checkPullSecretWithLabel(pullSecretName, namespaceArg)) {
            ghCore.info(`Secret "${pullSecretName}" with label "${secretLabel}" exists, deleting secret...`);
            const ocExecArgs = [
                Oc.Commands.Delete, Oc.SubCommands.Secret, pullSecretName,
            ];
            if (namespaceArg) {
                ocExecArgs.push(namespaceArg);
            }

            await Oc.exec(ocExecArgs);
        }
        else {
            ghCore.info(`Secret "${pullSecretName}" with label "${secretLabel}" doesn't exist`);
        }
    }
}

export default Deploy;
