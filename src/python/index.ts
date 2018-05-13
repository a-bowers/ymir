import { platform } from 'os';
import { IDict } from '../IDict';

import bindings = require('bindings');
import { PyRef } from './PyRef';
// Prepare the python interpretor here

export type ImportFunction = (module: string) => any;
export interface IPythonNode {
    import: ImportFunction;
}

const python: IPythonNode = bindings('binding.node');
const originalImport = python.import;

python.import = (modName: string) => PyRef(originalImport(modName));

if (platform() === 'win32' && !process.env.PYTHONHOME) {
    throw new Error('PYTHONHOME not set');
}
/*
    // Add local path to sys
    const sys = python.import('sys');
    sys.path.append(process.cwd());
*/
export * from './PyException';
export * from './Iterator';
export * from './io';
export * from './BytesIOStream';
export * from './len';
export * from './PyType';
export * from './PyRef';

export { python as instance };
