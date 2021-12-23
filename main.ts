import Client from './src/core/Client';
import Server from './src/server/main';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const client = new Client({
    intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_INVITES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'GUILD_VOICE_STATES',
        'GUILD_WEBHOOKS',
    ],
});
client.login();
const rest = new REST({ version: '9' }).setToken(client.settings.TOKEN);

function GetCmds() {
    return new Promise((resolve, _) => {
        let arr = [];
        client.commands.modules.forEach((x) => {
            arr.push(x.data.toJSON());
        });
        resolve(arr);
    });
}
client.on('ready', async () => {
    let commands = await GetCmds();
    await rest.put(
        Routes.applicationGuildCommands(
            client.user.id,
            client.settings.TESTGUILD
        ),
        { body: commands }
    );
});
client.on('ready', () => Server(client));
