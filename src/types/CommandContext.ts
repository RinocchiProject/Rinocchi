import Client from '../core/Client';
import { Message } from 'discord.js';

export default class Context {
    public client: Client;
    public message: Message;
    public args: string[];
    public locale: any;
    constructor(client: Client, message: Message, args: string[], locale: any) {
        this.client = client;
        this.args = args;
        this.locale = locale;
        this.message = message;
    }
}
