import Command from '../../core/Command';
import Context from '../../types/CommandContext';
import Request from '../../util/getUser';
import ParseMention from '../../util/getUserFromMention';
import ApiUserType from '../../types/UserApiType';
import { MessageEmbed } from 'discord.js';

export default class Avatar extends Command {
    public name: string = 'avatar';
    public aliases: string[] = ['a'];
    public dev: boolean = false;
    public async run(context: Context): Promise<void> {
        let { client, message, args, locale } = context,
            user: any =
                ParseMention(client, args[0]) ||
                (await Request.obj(args[0], client.settings.TOKEN)) ||
                message.author,
            apiUser: ApiUserType = await Request.obj(
                user.id,
                client.settings.TOKEN
            ),
            emb = new MessageEmbed()
                .setTitle(
                    locale('commands:avatar.emb.title', {
                        username: `${apiUser.username}#${apiUser.discriminator}`,
                    })
                )
                .setColor('RANDOM')
                .setImage(
                    await Request.avatar(
                        apiUser.id,
                        2048,
                        client.settings.TOKEN
                    )
                );
        message.reply({ embeds: [emb] });
    }
}
