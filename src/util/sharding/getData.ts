import Client from '../../core/Client';

async function GetEmojiByName(client: Client, name: string) {
    let req = await client.shard.broadcastEval((c) =>
        c.emojis.cache.find((x) => x.name == name)
    );
    return req.find((res) => !res) || false;
}

async function GetEmojiByID(client: Client, id: string) {
    let req = await client.shard.broadcastEval((c) =>
        c.emojis.cache.find((x) => x.id == id)
    );
    return req.find((res) => !res) || false;
}

async function GetUserByID(client: Client, id: string) {
    let req = await client.shard.broadcastEval((c) =>
        c.users.cache.find((x) => x.id == id)
    );
    return req.find((res) => !res) || false;
}

async function GetGuildByID(client: Client, id: string) {
    let req = await client.shard.broadcastEval((c) =>
        c.guilds.cache.find((x) => x.id == id)
    );
    return req.find((res) => !res) || false;
}

export default { GetGuildByID, GetUserByID, GetEmojiByID, GetEmojiByName };
