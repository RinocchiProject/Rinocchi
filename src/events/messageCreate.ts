import Client from '../core/Client';
import Event from '../core/Event';
import { Message } from 'discord.js';

export default class MessageCreate extends Event {
    public name: string = 'messageCreate';
    public run(client: Client, message: Message) {
        console.log(`${message.author.tag} -> ${message.content}`);
    }
}
