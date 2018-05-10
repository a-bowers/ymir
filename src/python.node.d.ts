declare module 'python.node' {
    interface ImportFunction {
        (module: string): any;
    }
    interface IPythonNode {
        import: ImportFunction;
    }
    const python: IPythonNode;

    export = python;
}
