import EventEmitter from 'events';
import { readdirSync, lstatSync } from 'fs';
import { resolve } from 'path';

class Store {
    public modules: any[];
    public events: EventEmitter;
    constructor() {
        this.modules = [];
        this.events = new EventEmitter();
    }
    public add(module: any): boolean {
        if (this.has(module?.name)) return false;
        this.modules.push(module);
        this.events.emit('added', module);
        return true;
    }
    public remove(name: string): boolean {
        if (!this.has(name)) return false;
        delete this.modules[this.get(name)];
        this.events.emit('removed', name);
        return true;
    }
    public get(name: string): any {
        return this.findBy('name', name);
    }
    public has(name: string): boolean {
        if (!this.findBy('name', name)) return false;
        else return true;
    }
    public loadPath(path: string, ...args: any[]): void {
        let files = [];
        path = resolve(__dirname, '../../../', path);

        readdirSync(resolve(path)).map((d) => {
            if (lstatSync(resolve(path, d)).isFile()) {
                files.push(require(resolve(path, d)));
            } else {
                readdirSync(resolve(path, d)).map((n) => {
                    files.push(require(resolve(path, d, n)));
                });
            }
        });
        files.map((M) => {
            const module = new M.default(...args);
            this.add(module);
        });
    }
    private findBy(property: string, value: any): any {
        return this.modules.filter((module) => module[property] == value)[0];
    }
}

export default Store;
