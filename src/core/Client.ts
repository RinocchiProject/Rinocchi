import { Client, ClientOptions } from 'discord.js';
import Locale from './Locales';
import Logs from '../util/Logger';
import CommandManager from './CommandManager';
import EventsManager from './EventsManager';
import { obj as Settings } from '../util/ConfigParser';

class Bot extends Client {
    public lang: Locale;
    public log: Logs;
    public commands: CommandManager;
    public events: EventsManager;
    public temp: Map<string, any> = new Map();
    private settings: typeof Settings = Settings;
    constructor(options?: ClientOptions) {
        super(options);
        this.lang = new Locale();
        this.log = new Logs();
        this.events = new EventsManager(this);
        this.commands = new CommandManager(this);
    }
    public async login(): Promise<string> {
        await this.lang.init();
        // this.commands.loadPath('./build/src/commands');
        this.events.loadPath('./build/src/events');
        this.log.ok('OK');
        return super.login(this.settings.TOKEN);
    }
}

export default Bot;
