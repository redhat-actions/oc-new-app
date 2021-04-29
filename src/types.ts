/***************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
**************************************************************************************************/

export type PullSecretData = {
    pullSecretName: string
    namespace: string
};

export type ExecResult = {
    exitCode: number;
    stdout: string;
    stderr: string;
};
