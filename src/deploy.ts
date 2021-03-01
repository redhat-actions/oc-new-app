/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import Oc from "./oc";

namespace Deploy {
    export async function newApp(appName: string, image: string): Promise<void> {
        const ocOptions = Oc.getOptions({ name: appName, "docker-image": image });
        const ocExecArgs = [ Oc.Commands.NewApp, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function deleteDeployment(appSelector: string): Promise<void> {
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Delete, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function patchSvc(appName: string, port: string): Promise<void> {
        const patchJson = `{ "spec": { "ports": [{ "name": "${port}-tcp", "port": ${port} }] } }`;
        const ocOptions = Oc.getOptions({ patch: patchJson });
        const ocExecArgs = [ Oc.Commands.Patch, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function exposeSvc(appName: string, svcPort: string): Promise<void> {
        const ocOptions = Oc.getOptions({ port: svcPort });
        const ocExecArgs = [ Oc.Commands.Expose, Oc.SubCommands.Service, appName, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function getDeployment(appSelector: string): Promise<void> {
        const ocOptions = Oc.getOptions({ selector: appSelector });
        const ocExecArgs = [ Oc.Commands.Get, Oc.SubCommands.All, ...ocOptions ];
        await Oc.exec(ocExecArgs);
    }

    export async function getRoute(appName: string): Promise<string> {
        const jsonPath = "'{.spec.host}'";
        const ocOptions = Oc.getOptions({ output: "" });
        const ocExecArgs = [
            Oc.Commands.Get, Oc.SubCommands.Route, appName, ...ocOptions, `jsonpath=${jsonPath}{"\\n"}`,
        ];
        const execResult = await Oc.exec(ocExecArgs);
        return execResult.out;
    }
}

export default Deploy;
