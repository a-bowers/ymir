import { IDict } from '../IDict';

export interface IPyObject {
    getAttr(key: string): IPyObject | undefined;
    call(...args: any[]): IPyObject | undefined;
    create(...args: any[]): IPyObject | undefined;
}
