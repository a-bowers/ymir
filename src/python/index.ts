import { platform } from 'os';
import { IDict } from '../IDict';
import instance from './instance';

// Prepare the python interpretor here
if (platform() === 'win32' && !process.env.PYTHONHOME) {
    throw new Error('PYTHONHOME not set');
}

export * from './PyException';
export * from './Iterator';
export * from './io';
export * from './BytesIOStream';
export * from './len';
export * from './PyType';
export * from './PyRef';

const sys = instance.import('sys');
sys.path.append(process.cwd());

export default instance;
