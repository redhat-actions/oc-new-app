/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as ghCore from "@actions/core";
import Oc from "./oc";

namespace Deploy {

    /**
     * Creates new app with the image provided
     * @param appName Name of the app to use in 'oc new-app' command
     * @param image Image to create application from
     */
    export async function newApp(appName: string, image: string): Promise<void> {
        ghCore.info("⏳ Creating Deployment from image of the application...");
        const ocOptions = Oc.getOptions({ name: appName, "docker-image": image });
        const ocExecArgs = [ Oc.Commands.NewApp, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    /**
     * Take down any old deployment
     * @param appSelector selector to filter out deployment
     */
    export async function deleteDeployment(appSelector: string): Promise<void> {
        ghCore.info("🔍 Checking for old deployments and deleting if found...");
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Delete, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    /**
     * Patch the created service with the port to expose
     * @param appName Name of the app for which to patch the service
     * @param port Port to expose
     */
    export async function patchSvc(appName: string, port: string): Promise<void> {
        ghCore.info(`⏳ Patching service with the port ${port} ...`);
        const patchJson = {
            spec: {
                ports: [
                    {
                        name: `${port}-tcp`,
                        port,
                    },
                ],
            },
        };
        const patchJsonString = JSON.stringify(patchJson);
        const ocOptions = Oc.getOptions({ patch: patchJsonString });
        const ocExecArgs = [ Oc.Commands.Patch, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    /**
     * Expose he route of the application service
     * @param appName Name of the app for which to expose the route
     * @param svcPort Port to expose
     */
    export async function exposeSvc(appName: string, svcPort: string): Promise<void> {
        ghCore.info(`Exposing the route for ${appName} service...`);
        const ocOptions = Oc.getOptions({ port: svcPort });
        const ocExecArgs = [ Oc.Commands.Expose, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    /**
     * Get all the deployments based on the selector filter
     * @param appSelector Selector to filter out the deployment
     */
    export async function getDeployment(appSelector: string): Promise<void> {
        ghCore.info("⏳ Verifying if deployment is created successfully...");
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Get, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    /**
     * Get route of the exposed service of the application
     * @param appName Name of the app for which to find the route
     */
    export async function getRoute(appName: string): Promise<string> {
        ghCore.info(`⏳ Fetching route of the ${appName} application...`);
        const jsonPath = "'{.spec.host}'";
        const ocOptions = Oc.getOptions({ output: "" });
        const ocExecArgs = [
            // add new line to 'oc get route' command output
            Oc.Commands.Get, Oc.SubCommands.Route, appName, ...ocOptions, `jsonpath=${jsonPath}{"\\n"}`,
        ];
        const execResult = await Oc.exec(ocExecArgs);
        return execResult.out;
    }
}

export default Deploy;
