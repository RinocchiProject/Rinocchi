import Command from '../../core//Command';
import Context from '../../types/CommandContext';

export default class Ping extends Command {
    public name: string = 'ping';
    public aliases: string[] = ['ms'];
    public dev: boolean = false;
    private parse(date1: any, date2: any) {
        return date1 - date2;
    }
    public async run(context: Context) {
        let { client, message, locale } = context,
            msg = await message.reply(locale('commands:ping.wait'));

        msg.edit(
            locale('commands:ping.result', {
                shard: client.shard.ids,
                ms: this.parse(msg.createdAt, message.createdAt),
                api: client.ws.ping,
            })
        );
    }
}
