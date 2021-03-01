/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as ghCore from "@actions/core";
import { Inputs } from "./generated/inputs-outputs";
import { getSelector } from "./utils";
import Oc from "./oc";

namespace Deploy {
    export async function newApp(): Promise<void> {
        const image = ghCore.getInput(Inputs.IMAGE);
        const appName = ghCore.getInput(Inputs.APP_NAME);

        const ocOptions = Oc.getOptions({ name: appName, "docker-image": image });
        const ocExecArgs = [ Oc.Commands.NewApp, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function deleteDeployment(): Promise<void> {
        const appSelector = getSelector();
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Delete, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function patchSvc(): Promise<void> {
        const appName = ghCore.getInput(Inputs.APP_NAME);
        const port = ghCore.getInput(Inputs.PORT);
        const patchJson = `{ "spec": { "ports": [{ "name": "${port}-tcp", "port": ${port} }] } }`;
        const ocOptions = Oc.getOptions({ patch: patchJson });
        const ocExecArgs = [ Oc.Commands.Patch, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function exposeSvc(): Promise<void> {
        const appName = ghCore.getInput(Inputs.APP_NAME);
        const svcPort = ghCore.getInput(Inputs.PORT);

        const ocOptions = Oc.getOptions({ port: svcPort });
        const ocExecArgs = [ Oc.Commands.Expose, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function getDeployment(): Promise<void> {
        const appSelector = getSelector();
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Get, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function getRoute(): Promise<string> {
        const appName = ghCore.getInput(Inputs.APP_NAME);
        const jsonPath = "'{.spec.host}'";
        const ocOptions = Oc.getOptions({ output: "" });
        const ocExecArgs = [
            Oc.Commands.Get, Oc.SubCommands.Route, appName, ...ocOptions, `jsonpath=${jsonPath}{"\\n"}` ];
        const execResult = await Oc.exec(ocExecArgs);
        return execResult.out;
    }
}

export default Deploy;
