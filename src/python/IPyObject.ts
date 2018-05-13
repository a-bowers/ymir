import { IDict } from '../IDict';

export interface IPyObject {
    __attr__: IDict<IPyObject | undefined>;
    getAttr(key: string): IPyObject | undefined;
    call(...args: any[]): IPyObject | undefined;
}
