import * as python from 'python.node';
import { IDict } from '../IDict';
// Prepare the python interpretor here

// Add local path to sys
const sys = python.import('sys');
sys.path.append(process.cwd());

export * from './PyException';
export * from './Iterator';
export * from './io';
export * from './BytesIOStream';

export { python as instance };
