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
     * @param buildEnvs List of build environment key value pairs (for S2I builds)
     * @param envs List of runtime environment key value pairs
     * @param appSelector Label to set in all the created resources
     * @param namespace Namespace in which to create new app
     */
    export async function newApp(
        appName: string,
        image: string,
        buildEnvs: string[],
        envs: string[],
        appSelector: string,
        namespaceArg?: string
    ): Promise<void> {
        ghCore.info("⏳ Creating Deployment from image of the application...");
        const ocOptions = Oc.getOptions({ name: appName, labels: appSelector });

        buildEnvs.forEach((buildEnv) => {
            ocOptions.push(...Oc.getOptions({ "build-env": buildEnv }));
        });

        envs.forEach((env) => {
            ocOptions.push(...Oc.getOptions({ env }));
        });

        const ocExecArgs = [ Oc.Commands.NewApp, ...ocOptions, image ];
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
    export async function exposeSvc(appName: string, svcPort?: string, namespaceArg?: string): Promise<void> {
        ghCore.info(`Exposing the route for "${appName}" service...`);

        const ocExecArgs = [ Oc.Commands.Expose, Oc.SubCommands.Service, appName ];

        if (svcPort) {
            const ocOptions = Oc.getOptions({ port: svcPort });
            ocExecArgs.push(...ocOptions);
        }

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

    const ROUTE_RETRY_COUNT = 10;
    const ROUTE_RETRY_DELAY_MS = 3000;

    /**
     * Get route of the exposed service of the application.
     * Retries if the route host is not yet populated (race condition
     * where the route object exists but .spec.host is still empty).
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

        for (let attempt = 1; attempt <= ROUTE_RETRY_COUNT; attempt++) {
            const execResult = await Oc.exec(ocExecArgs);
            const host = execResult.stdout.trim();
            if (host) {
                return host;
            }
            if (attempt < ROUTE_RETRY_COUNT) {
                ghCore.info(
                    `Route host not yet available (attempt ${attempt}/${ROUTE_RETRY_COUNT}), `
                    + `retrying in ${ROUTE_RETRY_DELAY_MS / 1000}s...`
                );
                await delay(ROUTE_RETRY_DELAY_MS);
            }
        }

        ghCore.warning(
            `Route host was not populated after ${ROUTE_RETRY_COUNT} attempts. `
            + `The route output may be incomplete.`
        );
        return "";
    }

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => { setTimeout(resolve, ms); });
    }

    export async function createPullSecretFromFile(
        pullSecretName: string,
        authFilePath: string,
        appSelector: string,
        namespaceArg?: string
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
        await addLabelToSecret(pullSecretName, appSelector, namespaceArg);
    }

    export async function createPullSecretFromCreds(
        pullSecretName: string,
        registryServer: string,
        registryUsername: string,
        registryPassword: string,
        appSelector: string,
        namespaceArg?: string
    ): Promise<void> {
        // check if pull secret exists or not
        if (await isPullSecretExists(pullSecretName, namespaceArg)) {
            ghCore.info(`ℹ️ Secret "${pullSecretName}" already present, using this secret`);
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

        await addLabelToSecret(pullSecretName, appSelector, namespaceArg);
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

    async function addLabelToSecret(pullSecretName: string, appSelector: string, namespaceArg?: string): Promise<void> {
        ghCore.info(`Adding label "${secretLabel}" to secret "${pullSecretName}"`);

        const ocExecArgs = [
            Oc.Commands.Label, Oc.SubCommands.Secret, pullSecretName, secretLabel, appSelector,
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
            const commandResult = await Oc.exec(
                ocExecArgs,
                { ignoreReturnCode: true, failOnStdErr: false, group: true }
            );
            if (commandResult.exitCode === 0) {
                return true;
            }
        }
        catch (error) {
            ghCore.info(`Error: ${error}`);
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
        const secretsList = execResult.stdout.trim().split(" ");

        return secretsList.some((secretName) => secretName === pullSecretName);
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
