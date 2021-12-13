import fetch from 'node-fetch';
import UserApiType from '../types/UserApiType';

export default {
    async obj(id: string, auth: string): Promise<undefined | UserApiType> {
        if (!id) return undefined;
        let baseUrl: string = 'https://discord.com/api/v9/users/',
            response = await fetch(`${baseUrl}${id}`, {
                method: 'GET',
                headers: { Authorization: `Bot ${auth}` },
            });
        return (await response.json()) as UserApiType;
    },
    async avatar(id: string, size: number, auth: string): Promise<string> {
        let hash = (await this.obj(id, auth)).avatar;
        return `https://cdn.discordapp.com/avatars/${id}/${hash}.${
            String(hash).startsWith('a_') ? 'gif' : 'png'
        }?size=${size}`;
    },
};
