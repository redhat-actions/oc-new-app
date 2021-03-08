/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as ghCore from "@actions/core";
import { Inputs, Outputs } from "./generated/inputs-outputs";
import Deploy from "./deploy";
import * as utils from "./utils";

async function run(): Promise<void> {
    ghCore.debug(`Runner OS is ${utils.getOS()}`);
    ghCore.debug(`Node version is ${process.version}`);

    const appName = ghCore.getInput(Inputs.APP_NAME);
    const image = ghCore.getInput(Inputs.IMAGE);
    const namespace = ghCore.getInput(Inputs.NAMESPACE);
    const port = ghCore.getInput(Inputs.PORT);

    const appSelector = utils.getSelector(appName);
    let namespaceArg = "";
    if (namespace) {
        namespaceArg = `--namespace=${namespace}`;
    }
    else {
        ghCore.info(`No namespace provided`);
    }

    // Take down any old deployment
    await Deploy.deleteDeployment(appSelector, namespaceArg);

    await Deploy.newApp(appName, image, namespaceArg);

    // Make sure the app port is exposed
    await Deploy.patchSvc(appName, port, namespaceArg);

    await Deploy.exposeSvc(appName, port, namespaceArg);

    await Deploy.getDeployment(appSelector, namespaceArg);

    let route = await Deploy.getRoute(appName, namespaceArg);
    // To make it appear as a URL
    route = `http://${route}`;
    ghCore.info(`✅ ${appName} is exposed at ${route}`);

    ghCore.setOutput(Outputs.ROUTE, route);
    ghCore.setOutput(Outputs.SELECTOR, appSelector);
}

run()
    .then(() => {
        ghCore.info("Success.");
    })
    .catch(ghCore.setFailed);
