import Client from './Client';
import Store from './Store';
import Event from './Event';

class EventManager extends Store {
    private client: Client;
    constructor(client: Client) {
        super();
        this.client = client;
        this.events.on('added', (module: Event) => {
            this.client.on(module.name, (...args) =>
                module.run(this.client, ...args)
            );
        });
    }
}

export default EventManager;
