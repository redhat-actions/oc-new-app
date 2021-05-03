/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/
import * as ghCore from "@actions/core";
import { promises as fs } from "fs";

type OS = "linux" | "macos" | "windows";

let currentOS: OS | undefined;

export function getOS(): OS {
    if (currentOS == null) {
        const rawOS = process.platform;
        if (rawOS === "win32") {
            currentOS = "windows";
        }
        else if (rawOS === "darwin") {
            currentOS = "macos";
        }
        else if (rawOS !== "linux") {
            ghCore.warning(`Unrecognized OS "${rawOS}"`);
            currentOS = "linux";
        }
        else {
            currentOS = "linux";
        }
    }

    return currentOS;
}

export function getSelector(appName: string): string {
    return `app=${appName}`;
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    }
    catch (err) {
        return false;
    }
}

export function getNamespaceArg(namespace: string): string {
    let namespaceArg = "";
    if (namespace) {
        namespaceArg = `--namespace=${namespace}`;
    }
    else {
        ghCore.info(`No namespace provided`);
    }

    return namespaceArg;
}
