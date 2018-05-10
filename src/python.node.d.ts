declare module "python.node" {
    export interface ImportFunction{
        (module: string): any
    }
    export interface IPythonNode {
            import : ImportFunction;
    }
    const python: IPythonNode;

    export default python;
}
