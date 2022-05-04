import Client from '../core/Client';
import { CommandInteraction } from 'discord.js';

interface RawOption {
    name: string;
    type: string;
    value?: any;
}

export default class Context {
    public client: Client;
    public message: CommandInteraction;
    public args: string[];
    public locale: any;
    public rawOptions: Readonly<RawOption[]>;
    constructor(
        client: Client,
        message: CommandInteraction,
        args: string[],
        locale: any,
        raw: Readonly<RawOption[]>
    ) {
        this.client = client;
        this.args = args;
        this.locale = locale;
        this.message = message;
        this.rawOptions = raw;
    }
}
