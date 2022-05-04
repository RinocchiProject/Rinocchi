import Client from './Client';
import Command from './Command';
import Store from './Store';

class CommandManager extends Store {
    private client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
    }
    public findByName(name: string) {
        return (
            this.modules.filter(
                (m) => m.name.toLowerCase() == name.toLowerCase()
            )[0] ||
            this.modules.filter((m) =>
                m.aliases
                    .map((str) => str.toLowerCase())
                    .includes(name.toLowerCase())
            )[0]
        );
    }
}

export default CommandManager;
