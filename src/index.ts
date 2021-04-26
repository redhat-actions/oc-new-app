/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as ghCore from "@actions/core";
import * as path from "path";
import * as os from "os";
import { Inputs, Outputs } from "./generated/inputs-outputs";
import Deploy from "./deploy";
import * as utils from "./utils";
import { PullSecretData } from "./types";

async function run(): Promise<PullSecretData | undefined> {
    ghCore.debug(`Runner OS is ${utils.getOS()}`);
    ghCore.debug(`Node version is ${process.version}`);

    const appName = ghCore.getInput(Inputs.APP_NAME);
    const image = ghCore.getInput(Inputs.IMAGE);
    const namespace = ghCore.getInput(Inputs.NAMESPACE);
    const port = ghCore.getInput(Inputs.PORT);
    let createPullSecretFrom = ghCore.getInput(Inputs.CREATE_PULL_SECRET_FROM);
    const registry = ghCore.getInput(Inputs.REGISTRY_HOSTNAME);
    const registryUsername = ghCore.getInput(Inputs.REGISTRY_USERNAME);
    const registryPassword = ghCore.getInput(Inputs.REGISTRY_PASSWORD);
    const imagePullSecretName = ghCore.getInput(Inputs.IMAGE_PULL_SECRET_NAME);

    const appSelector = utils.getSelector(appName);

    const namespaceArg = utils.getNamespaceArg(namespace);

    let pullSecretName = "auth-file-secret";
    // boolean value to check if pull secret is created or not
    let isPullSecretCreated = false;

    if (imagePullSecretName) {
        if (await Deploy.isPullSecretExists(imagePullSecretName, namespaceArg)) {
            ghCore.info(`Using the provided secret "${imagePullSecretName}"`);
            await Deploy.linkSecretToServiceAccount(imagePullSecretName, namespaceArg);
        }
        else {
            throw new Error(`❌ Secret ${imagePullSecretName} not found. Make sure that the provided secret exists`);
        }
    }
    else if (createPullSecretFrom) {
        createPullSecretFrom = createPullSecretFrom.toLowerCase();
        if (createPullSecretFrom === "docker" || createPullSecretFrom === "podman") {
            isPullSecretCreated = await createPullSecretFromAuthFile(
                pullSecretName, createPullSecretFrom, namespaceArg
            );
        }
    }
    else if (registry) {
        pullSecretName = "registry-creds-secret";
        isPullSecretCreated = await createPullSecretFromRegistryCreds(
            pullSecretName, registry, registryUsername, registryPassword, namespaceArg
        );
    }

    // Take down any old deployment
    await Deploy.deleteDeployment(appSelector, namespaceArg);

    await Deploy.newApp(appName, image, namespaceArg);

    // Make sure the app port is exposed
    await Deploy.patchSvc(appName, port, namespaceArg);

    await Deploy.exposeSvc(appName, port, namespaceArg);

    await Deploy.getDeployment(appSelector, namespaceArg);

    // To make it appear as a URL
    const route = `http://${await Deploy.getRoute(appName, namespaceArg)}`;
    ghCore.info(`✅ ${appName} is exposed at ${route}`);

    ghCore.setOutput(Outputs.ROUTE, route);
    ghCore.setOutput(Outputs.SELECTOR, appSelector);

    if (isPullSecretCreated) {
        return {
            pullSecretName, namespace,
        };
    }

    return undefined;
}

async function createPullSecretFromAuthFile(
    pullSecretName: string, createPullSecretFrom: "docker" | "podman", namespaceArg: string
): Promise<boolean> {
    let pullSecretCreated: boolean;
    if (createPullSecretFrom === "docker") {
        pullSecretCreated = await createPullSecretFromDocker(pullSecretName, namespaceArg);
    }
    else {
        pullSecretCreated = await createPullSecretFromPodman(pullSecretName, namespaceArg);
    }

    return pullSecretCreated;
}

async function createPullSecretFromDocker(pullSecretName: string, namespaceArg: string): Promise<boolean> {
    const dockerAuthFilePath = path.join(os.homedir(), ".docker/config.json");
    if (await utils.fileExists(dockerAuthFilePath)) {
        await Deploy.createPullSecretFromFile(pullSecretName, dockerAuthFilePath, namespaceArg);
        await Deploy.linkSecretToServiceAccount(pullSecretName, namespaceArg);
    }
    else {
        throw new Error(`❌ Docker auth file not found at ${dockerAuthFilePath}. `
        + `Failed to create the pull secret.`);
    }

    return true;
}

async function createPullSecretFromPodman(pullSecretName: string, namespaceArg: string): Promise<boolean> {
    const podmanAuthFilePath = path.join("/tmp", `podman-run-${process.getuid()}`, "containers/auth.json");
    if (await utils.fileExists(podmanAuthFilePath)) {
        await Deploy.createPullSecretFromFile(pullSecretName, podmanAuthFilePath, namespaceArg);
        await Deploy.linkSecretToServiceAccount(pullSecretName, namespaceArg);
    }
    else {
        throw new Error(`❌ Podman auth file not found at ${podmanAuthFilePath}. `
        + `Failed to create the pull secret.`);
    }

    return true;
}

async function createPullSecretFromRegistryCreds(
    pullSecretName: string, registry: string, registryUsername: string, registryPassword: string, namespaceArg: string
): Promise<boolean> {
    if (isUsernameAndPasswordProvided(registryUsername, registryPassword)) {
        await Deploy.createPullSecretFromCreds(
            pullSecretName, registry, registryUsername, registryPassword, namespaceArg
        );

        return true;
    }
    ghCore.warning(`Inputs ${Inputs.REGISTRY_USERNAME} and ${Inputs.REGISTRY_PASSWORD} are missing. `
    + `Pull secret will not be created.`);

    return false;
}

function isUsernameAndPasswordProvided(registryUsername: string, registryPassword: string): boolean {
    if (registryUsername && !registryPassword) {
        ghCore.warning(`Input ${Inputs.REGISTRY_USERNAME} is provided but ${Inputs.REGISTRY_PASSWORD} is missing. `
        + `Pull secret will not be created.`);
    }
    else if (!registryUsername && registryPassword) {
        ghCore.warning(`Input ${Inputs.REGISTRY_PASSWORD} is provided but ${Inputs.REGISTRY_USERNAME} is missing. `
        + `Pull secret will not be created.`);
    }
    else if (registryUsername && registryPassword) {
        return true;
    }

    return false;
}

run()
    .then(async (pullSecretData) => {
        ghCore.info("Success.");
        if (pullSecretData) {
            const namespaceArg = utils.getNamespaceArg(pullSecretData.namespace);
            await Deploy.deletePullSecretWithLabel(pullSecretData.pullSecretName, namespaceArg);
        }
    })
    .catch((err) => {
        ghCore.setFailed(err.message);
    });
