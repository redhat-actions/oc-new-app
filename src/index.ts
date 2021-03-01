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

    // Take down any old deployment
    await Deploy.deleteDeployment();

    await Deploy.newApp();

    // Make sure the app port is exposed
    await Deploy.patchSvc();

    await Deploy.exposeSvc();

    await Deploy.getDeployment();

    const route = await Deploy.getRoute();
    ghCore.info(`${appName} is exposed to ${route}`);

    ghCore.setOutput(Outputs.ROUTE, route);
}

run()
    .then(() => {
        ghCore.info("Success.");
    })
    .catch(ghCore.setFailed);
