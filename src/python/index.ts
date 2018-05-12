import { platform } from 'os';
import * as python from 'python.node';
import { IDict } from '../IDict';
// Prepare the python interpretor here

if (platform() === 'win32' && !process.env.PYTHONHOME) {
    throw new Error('PYTHONHOME not set');
}
// Add local path to sys
const sys = python.import('sys');
sys.path.append(process.cwd());

export * from './PyException';
export * from './Iterator';
export * from './io';
export * from './BytesIOStream';
export * from './len';
export * from './PyType';

export { python as instance };
