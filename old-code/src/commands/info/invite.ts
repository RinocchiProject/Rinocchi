import Command from '../../core/Command';
import InviteInfo from '../../util/fetchInviteInfo';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';

export default class Invite extends Command {
    public name = 'invite';
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get information from an invite')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('Full invite url')
                .setRequired(true)
        );
    public async run(context: Context) {
        let { client, args, message, locale } = context,
            info = await InviteInfo.get(args[0], client.settings.TOKEN);

        if (info == null) {
            message.followUp(locale('commands:invite.unknow'));
            return;
        }

        let emb = new MessageEmbed()
            .setTitle(`${info.code} - ${info.guild.name}`)
            .setDescription(
                info.guild.description || locale('commands:invite.description')
            )
            .addField(
                locale('commands:invite.inviter.title'),
                info.inviter
                    ? locale('commands:invite.inviter.value.hasUser', {
                          id: info.inviter.id,
                          name: info.inviter.username,
                          code: info.inviter.discriminator,
                      })
                    : locale('commands:invite.inviter.value.notUser')
            )
            .addField(
                locale('commands:invite.expires_at.title'),
                info.expires_at == null
                    ? locale('commands:invite.expires_at.value.null')
                    : locale('commands:invite.expires_at.value.date', {
                          date: Math.round(
                              new Date(info.expires_at).getTime() / 1000
                          ),
                      }),
                true
            )
            .addField(
                locale('commands:invite.nsfw.title'),
                `${
                    info.guild.nsfw
                        ? locale('commands:invite.nsfw.true')
                        : locale('commands:invite.nsfw.false')
                } | ${locale('commands:invite.nsfw.level', {
                    lvl: info.guild.nsfw_level || 0,
                })}`
            )
            .addField(
                locale('commands:invite.members.title'),
                locale('commands:invite.members.value', {
                    presence: Number(
                        info.approximate_presence_count
                    ).toLocaleString(locale('commands:locale_string')),
                    total: Number(info.approximate_member_count).toLocaleString(
                        locale('commands:locale_string')
                    ),
                    calc: Math.floor(
                        (100 * info.approximate_presence_count) /
                            info.approximate_member_count
                    ).toFixed(2),
                })
            )
            .addField(
                locale('commands:invite.files.title'),
                `${
                    info.guild.banner
                        ? locale('commands:invite.files.banner.has', {
                              url: InviteInfo.fetchImages(
                                  'banners',
                                  info.guild.id,
                                  info.guild.banner,
                                  2048
                              ),
                          })
                        : locale('commands:invite.files.banner.null')
                } | ${
                    info.guild.splash
                        ? locale('commands:invite.files.splashs.has', {
                              url: InviteInfo.fetchImages(
                                  'splashes',
                                  info.guild.id,
                                  info.guild.splash,
                                  2048
                              ),
                          })
                        : locale('commands:invite.files.splashs.null')
                } | ${
                    info.guild.icon
                        ? locale('commands:invite.files.icon.has', {
                              url: InviteInfo.fetchImages(
                                  'icons',
                                  info.guild.id,
                                  info.guild.icon,
                                  2048
                              ),
                          })
                        : locale('commands:invite.files.icon.null')
                }`
            )
            .setColor('AQUA');

        message.followUp({ embeds: [emb] });
    }
}
