import Command from '../../core/Command';
import Context from '../../types/CommandContext';
import util from 'util';

export default class Eval extends Command {
    public name: string = 'eval';
    public dev: boolean = true;
    public aliases: string[] = ['e', 'execute'];
    public async run(context: Context): Promise<void> {
        let { client, message, args, locale } = context;
        try {
            let evaled = await eval(args.join(' '));
            evaled = util.inspect(evaled, { depth: 1 });
            evaled = evaled.replace(
                new RegExp(client.settings.TOKEN, 'g'),
                '###'
            );
            evaled = evaled.replace(
                new RegExp(client.settings.HOST, 'g'),
                '###'
            );
            evaled = evaled.replace(
                new RegExp(client.settings.PASSWORD, 'g'),
                '###'
            );

            if (evaled.length > 1800) evaled = `${evaled.slice(0, 1797)}...`;
            evaled = `\`\`\`js\n ${evaled}\`\`\``;

            message.channel.send(evaled);
        } catch (err) {
            err = `\`\`\`js\n ${err}\`\`\``;
            message.channel.send(err);
        }
    }
}
