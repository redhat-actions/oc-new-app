/*************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *************************************************************************************************/

import * as os from "os";
import * as ghExec from "@actions/exec";
import * as ghCore from "@actions/core";
import * as util from "./utils";

const EXECUTABLE = util.getOS() === "windows" ? "oc.exe" : "oc";

namespace Oc {
    /**
     * oc commands.
     */
    export enum Commands {
        Delete = "delete",
        NewApp = "new-app",
        Patch = "patch",
        Expose = "expose",
        Get = "get",
        Create = "create",
        Secrets = "secrets",
    }

    /**
     * oc sub-commands.
     */
    export enum SubCommands {
        All = "all",
        Service = "service",
        Route = "route",
        Secret = "secret",
        Link = "link",
    }

    /**
     * oc flags. Create an Options object with these, and then pass it to getOptions.
     */
    export enum Flags {
        Selector = "selector",
        Name = "name",
        DockerImage = "docker-image",
        Port = "port",
        Patch = "patch",
        Output = "output",
        JSONPath = "jsonpath",
        Namespace = "namespace",
        FromFile = "from-file",
        Type = "type",
        For = "for",
        DockerServer = "docker-server",
        DockerUsername = "docker-username",
        DockerPassword = "docker-password",
    }

    export type Options = { [key in Flags]?: string };

    /**
     * This formats an Options object into a string[] which is suitable to be passed to `exec`.
     *
     * Flags are prefixed with `--`, and suffixed with `=${value}`, unless the value is the empty string.
     *
     * For example, `{ flatten: "", minify: "true" }` is formatted into `[ "--flatten", "--minify=true" ]`.
     */
    export function getOptions(options: Options): string[] {
        return Object.entries<string | undefined>(options).reduce((argsBuilder: string[], entry) => {
            const [ key, value ] = entry;

            if (value == null) {
                return argsBuilder;
            }

            let arg = "--" + key;
            if (value !== "") {
                arg += `=${value}`;
            }
            argsBuilder.push(arg);

            return argsBuilder;
        }, []);
    }

    /**
     * Run 'oc' with the given arguments.
     *
     * @throws If the exitCode is not 0, unless execOptions.ignoreReturnCode is set.
     *
     * @param args Arguments and options to 'oc'. Use getOptions to convert an options mapping into a string[].
     * @param execOptions Options for how to run the exec. See note about hideOutput on windows.
     * @returns Exit code and the contents of stdout/stderr.
     */
    export async function exec(
        args: string[],
        execOptions: ghExec.ExecOptions & { group?: boolean } = {}
    ):Promise<{ exitCode: number, out: string, err: string }> {
        // ghCore.info(`${EXECUTABLE} ${args.join(" ")}`)

        let stdout = "";
        let stderr = "";

        const finalExecOptions = { ...execOptions };
        finalExecOptions.ignoreReturnCode = true;     // the return code is processed below

        finalExecOptions.listeners = {
            stdline: (line): void => {
                stdout += line + os.EOL;
            },
            errline: (line): void => {
                stderr += line + os.EOL;
            },
        };

        if (execOptions.group) {
            const groupName = [ EXECUTABLE, ...args ].join(" ");
            ghCore.startGroup(groupName);
        }

        try {
            const exitCode = await ghExec.exec(EXECUTABLE, args, finalExecOptions);

            if (execOptions.ignoreReturnCode !== true && exitCode !== 0) {
                // Throwing the stderr as part of the Error makes the stderr show up in the action outline,
                // which saves some clicking when debugging.
                let error = `oc exited with code ${exitCode}`;
                if (stderr) {
                    error += `\n${stderr}`;
                }
                throw new Error(error);
            }

            return {
                exitCode, out: stdout, err: stderr,
            };
        }

        finally {
            if (execOptions.group) {
                ghCore.endGroup();
            }
        }
    }

}

export default Oc;
