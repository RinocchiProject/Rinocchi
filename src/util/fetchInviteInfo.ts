import Fetch from 'node-fetch';
import Client from '../core/Client';
import InviteType from '../types/InviteApiType';

export default {
    async get(
        code: string,
        auth: string
    ): Promise<undefined | null | InviteType> {
        if (!code) return undefined;
        if (!code.match(/https:\/\/discord\.gg\/.+/)) return null;
        if (code.replace('https://discord.gg/', '') == '') return null;
        code = code.replace('https://discord.gg/', '');

        let baseUrl = 'https://discord.com/api/v9/invites/',
            response = await Fetch(`${baseUrl}${code}?with_counts=true`, {
                method: 'GET',
                headers: { Authorization: `Bot ${auth}` },
            });
        if (!response.ok) return null;

        return (await response.json()) as InviteType;
    },
    fetchImages(
        type: 'banners' | 'splashes' | 'icons',
        guild: string,
        hash: string,
        size: number
    ): string {
        return `https://cdn.discordapp.com/${type}/${guild}/${hash}.${
            hash.startsWith('a_') ? 'gif' : 'png'
        }?size=${size}`;
    },
};
