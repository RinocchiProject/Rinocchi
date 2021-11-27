import { readFileSync } from 'fs';
import Parse from './src/util/ConfigParser';
import Client from './src/core/Client';

const content = readFileSync('./CONFIG', 'utf-8'),
    obj = Object.assign({}, ...Parse(content));

global.settings = obj;
