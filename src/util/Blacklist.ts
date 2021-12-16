import Client from '../core/Client';
import { query } from './Database';

interface BlacklistType {
    store(
        client: Client,
        type: string,
        id: string,
        value: boolean
    ): Promise<void>;
    hasGuild(id: string): Promise<boolean>;
    hasUser(id: string): Promise<boolean>;
}

const Blacklist: BlacklistType = {
    async store(client: Client, type: string, id: string, value: boolean) {
        client.temp.set(`blacklist.${type}.${id}`, value);
    },
    async hasUser(id: string) {
        let { results } = await query(
            'SELECT (ban) FROM blacklist_user WHERE id=?',
            [`${id}`]
        );
        if (typeof results[0] == 'undefined') return false;
        else return Boolean(results[0].ban);
    },
    async hasGuild(id: string) {
        let { results } = await query(
            'SELECT (ban) FROM blacklist_guild WHERE id=?',
            [`${id}`]
        );
        if (typeof results[0] == 'undefined') return false;
        else return Boolean(results[0].ban);
    },
};

export default Blacklist;
