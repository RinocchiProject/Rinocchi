import Client from '../core/Client';
import Event from '../core/Event';
import { Message } from 'discord.js';
import { query } from '../util/Database';
import Command from '../core/Command';
import Context from '../types/CommandContext';
import Cooldown from '../core/Cooldown';

export default class MessageCreate extends Event {
    public name: string = 'messageCreate';
    private async fetchUserLang(id: string, client: Client): Promise<string> {
        if (client.temp.has(`lang.${id}`)) {
            return client.temp.get(`lang.${id}`);
        } else {
            let { results } = await query(
                `SELECT (lang) FROM user_lang WHERE id=?`,
                [`${id}`]
            );
            if (typeof results[0] == 'undefined') {
                client.temp.set(`lang.${id}`, 'pt-BR');
                return 'pt-BR';
            }
            client.temp.set(`lang.${id}`, results[0].lang);
            return results[0].lang;
        }
    }
    private async fetchGuildPrefix(
        id: string,
        client: Client
    ): Promise<string> {
        if (client.temp.has(`prefix.${id}`)) {
            return client.temp.get(`prefix.${id}`);
        } else {
            let { results } = await query(
                `SELECT (prefix) FROM guild_prefix WHERE id=?`,
                [`${id}`]
            );
            if (typeof results[0] == 'undefined') {
                client.temp.set(`prefix.${id}`, 'r?');
                return 'r?';
            }
            client.temp.set(`prefix.${id}`, results[0].prefix);
            return results[0].prefix;
        }
    }
    public async run(client: Client, message: Message) {
        if (message.author.bot || message.webhookId || !message.guild.id)
            return;

        let userLang = await this.fetchUserLang(message.author.id, client),
            guildPrefix = await this.fetchGuildPrefix(message.guild.id, client),
            Locale = await client.lang.load(userLang);
        if (message.content.replace(/[<@!>]/g, '') == client.user.id) {
            message.reply(Locale('basic:mention', { prefix: guildPrefix }));
            return;
        }
        if (!message.content.startsWith(guildPrefix)) return;

        let args = message.content.replace(guildPrefix, '').trim().split(/ /g);
        let commandName = args.shift().toLowerCase(),
            command: Command = client.commands.findByName(commandName),
            context = new Context(client, message, args, Locale);

        if (Cooldown.users.has(message.author.id)) {
            let usrCooldownTime: any = Cooldown.getTime(message.author.id);
            if (usrCooldownTime < 0)
                usrCooldownTime = Locale('basic:cooldown.thousandths');
            else
                usrCooldownTime = `${usrCooldownTime.toFixed(0)} ${
                    usrCooldownTime == 1
                        ? Locale('basic:cooldown.second')
                        : Locale('basic:cooldown.seconds')
                }`;
            return message.reply(
                Locale('basic:cooldown.message', { time: usrCooldownTime })
            );
        } else Cooldown.set(message.author.id);
        if (!command)
            return message.reply(
                Locale('errors:command.unknow', { name: commandName })
            );
        if (command.dev == true && message.author.id !== client.settings.OWNER)
            return;
        command.run(context);
    }
}
