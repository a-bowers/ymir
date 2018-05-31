import bindings = require('bindings');
import { PyRef } from './PyRef';

const python: IPythonNode = bindings('binding.node');
const wrappedPython = {
    import: (modName: string) => PyRef(python.import(modName)),
};

export type ImportFunction = (module: string) => any;

export interface IPythonNode {
    import: ImportFunction;
}

export default wrappedPython;
