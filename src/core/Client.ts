import { Client, Collection, ClientOptions } from 'discord.js';
import Locale from './Locales';
import Logs from '../util/Logger';
import CommandManager from './CommandManager';
import EventsManager from './EventsManager';

class Bot extends Client {
    public lang: Locale;
    public log: Logs;
    public commands: CommandManager;
    public events: EventsManager;
    constructor(options: ClientOptions) {
        super(options);
        this.lang = new Locale();
        this.log = new Logs();
        this.events = new EventsManager(this);
        this.commands = new CommandManager(this);
    }
    public async login(token: string): Promise<string> {
        await this.lang.init();
        this.commands.loadPath('./src/commands');
        this.events.loadPath('./src/events');
        this.log.ok('OK');
        return super.login(token);
    }
}

export default Bot;
