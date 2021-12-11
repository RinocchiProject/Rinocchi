import Command from '../../core/Command';
import Context from '../../types/CommandContext';
import { query } from '../../util/Database';
export default class Prefix extends Command {
    public name: string = 'prefix';
    public aliases: string[] = ['changeprefix'];
    public dev: boolean = false;
    public async run(context: Context): Promise<void> {
        let { client, message, args, locale } = context;
        if (args.length == 0 || args[0].length > 3) {
            message.reply(locale('commands:prefix.error'));
            return;
        }
        let old = client.temp.get(`prefix.${message.guild.id}`);
        client.temp.set(`prefix.${message.guild.id}`, args[0]);
        let { results } = await query(
            'SELECT (prefix) FROM guild_prefix WHERE id=?',
            [`${message.guild.id}`]
        );
        if (typeof results[0] == 'undefined')
            await query('INSERT INTO guild_prefix (id, prefix) VALUES (?, ?)', [
                `${message.guild.id}`,
                args[0],
            ]);
        else
            await query('UPDATE guild_prefix SET prefix=? WHERE id=?', [
                args[0],
                `${message.guild.id}`,
            ]);
        message.reply(locale('commands:prefix.ok', { old: old, new: args[0] }));
    }
}
