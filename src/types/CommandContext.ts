import Client from '../core/Client';
import { CommandInteraction } from 'discord.js';

export default class Context {
    public client: Client;
    public message: CommandInteraction;
    public args: string[];
    public locale: any;
    constructor(
        client: Client,
        message: CommandInteraction,
        args: string[],
        locale: any
    ) {
        this.client = client;
        this.args = args;
        this.locale = locale;
        this.message = message;
    }
}
