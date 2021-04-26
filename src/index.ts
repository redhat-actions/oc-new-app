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

// boolean value to check if pull secret is created or not
let isPullSecretCreated = false;

let pullSecretName: string;
let namespaceArg: string | undefined;

async function run(): Promise<void> {
    ghCore.debug(`Runner OS is ${utils.getOS()}`);
    ghCore.debug(`Node version is ${process.version}`);

    const appName = ghCore.getInput(Inputs.APP_NAME);
    const image = ghCore.getInput(Inputs.IMAGE);
    const namespace = ghCore.getInput(Inputs.NAMESPACE);
    const port = ghCore.getInput(Inputs.PORT);
    const createPullSecretFrom = ghCore.getInput(Inputs.CREATE_PULL_SECRET_FROM);
    const registry = ghCore.getInput(Inputs.REGISTRY_HOSTNAME);
    const registryUsername = ghCore.getInput(Inputs.REGISTRY_USERNAME);
    const registryPassword = ghCore.getInput(Inputs.REGISTRY_PASSWORD);
    const imagePullSecretName = ghCore.getInput(Inputs.IMAGE_PULL_SECRET_NAME);

    const appSelector = utils.getSelector(appName);

    if (namespace) {
        namespaceArg = `--namespace=${namespace}`;
    }
    else {
        ghCore.info(`No namespace provided`);
    }

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
        await createPullSecretFromAuthFile(createPullSecretFrom);
    }
    else if (registry) {
        await createPullSecretFromRegistryCreds(registry, registryUsername, registryPassword);
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
}

async function createPullSecretFromAuthFile(createPullSecretFrom: string): Promise<void> {
    if (createPullSecretFrom === "docker") {
        isPullSecretCreated = await createPullSecretFromDocker();
    }
    else if (createPullSecretFrom === "podman") {
        isPullSecretCreated = await createPullSecretFromPodman();
    }
}

async function createPullSecretFromDocker(): Promise<boolean> {
    const dockerAuthFilePath = path.join(os.homedir(), ".docker/config.json");
    if (await utils.fileExists(dockerAuthFilePath)) {
        pullSecretName = "docker-pull-secret";
        await Deploy.createPullSecretFromFile(pullSecretName, dockerAuthFilePath, namespaceArg);
        await Deploy.linkSecretToServiceAccount(pullSecretName, namespaceArg);
    }
    else {
        throw new Error(`❌ Docker auth file not found at ${dockerAuthFilePath}. `
        + `Failed to create the pull secret.`);
    }

    return true;
}

async function createPullSecretFromPodman(): Promise<boolean> {
    const podmanAuthFilePath = path.join("/tmp", `podman-run-${process.getuid()}`, "containers/auth.json");
    if (await utils.fileExists(podmanAuthFilePath)) {
        pullSecretName = "podman-pull-secret";
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
    registry: string, registryUsername: string, registryPassword: string
): Promise<void> {
    if (isUsernameAndPasswordProvided(registryUsername, registryPassword)) {
        pullSecretName = "registry-creds-secret";
        await Deploy.createPullSecretFromCreds(
            pullSecretName, registry, registryUsername, registryPassword, namespaceArg
        );

        // setting it to true, to delete once app is deployed
        isPullSecretCreated = true;
    }
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
    else if (!registryUsername && !registryPassword) {
        ghCore.warning(`Input ${Inputs.REGISTRY_USERNAME} and ${Inputs.REGISTRY_PASSWORD} is missing. `
        + `Pull secret will not be created.`);
    }
    else {
        return true;
    }

    return false;
}

run()
    .then(async () => {
        ghCore.info("Success.");
        if (isPullSecretCreated) {
            await Deploy.deletePullSecretWithLabel(pullSecretName, namespaceArg);
        }
    })
    .catch((err) => {
        ghCore.setFailed(err.message);
    });
