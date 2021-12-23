import Command from '../../core/Command';
import Request from '../../util/getUser';
import Client from '../../core/Client';
import ApiUserType from '../../types/UserApiType';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';

export default class Avatar extends Command {
    public name: string = 'avatar';
    public dev: boolean = false;
    public data = new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(
            'Get the avatar of any discord user (by ID) or by mention'
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Mention the user or enter an ID')
                .setRequired(false)
        );
    public async run(context: Context): Promise<void> {
        let { client, message, args, locale } = context,
            user: any =
                (await Request.obj(args[0], client.settings.TOKEN)) ||
                message.user,
            apiUser: ApiUserType = await Request.obj(
                user.id,
                client.settings.TOKEN
            );
        if (!apiUser.id) {
            message?.followUp('commands:avatar.unknow_user');
            return;
        }
        let emb = new MessageEmbed()
            .setTitle(
                locale('commands:avatar.emb.title', {
                    username: `${apiUser.username}#${apiUser.discriminator}`,
                })
            )
            .setColor('RANDOM')
            .setImage(
                await Request.avatar(apiUser.id, 2048, client.settings.TOKEN)
            );
        message?.followUp({ embeds: [emb] });
    }
}
