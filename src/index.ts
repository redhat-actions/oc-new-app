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
    const port = ghCore.getInput(Inputs.PORT);

    const appSelector = utils.getSelector(appName);

    // Take down any old deployment
    await Deploy.deleteDeployment(appSelector);

    await Deploy.newApp(appName, image);

    // Make sure the app port is exposed
    await Deploy.patchSvc(appName, port);

    await Deploy.exposeSvc(appName, port);

    await Deploy.getDeployment(appSelector);

    const route = await Deploy.getRoute(appName);
    ghCore.info(`✅ ${appName} is exposed to ${route}`);

    ghCore.setOutput(Outputs.ROUTE, route);
    ghCore.setOutput(Outputs.SELECTOR, appSelector);
}

run()
    .then(() => {
        ghCore.info("Success.");
    })
    .catch(ghCore.setFailed);
