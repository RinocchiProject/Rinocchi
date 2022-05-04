import Client from '../core/Client';
import Listener from '../core/Event';

export default class Ready extends Listener {
    public name: string = 'ready';
    public run(client: Client) {
        client.log.ok('Online');
    }
}
