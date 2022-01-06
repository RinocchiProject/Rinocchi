import Command from '../../core/Command';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';
import { query } from '../../util/Database';
import ParseSize from '../../util/ParseSize';
import { filledBar } from 'string-progressbar';

export default class Storage extends Command {
    public name = 'storage';
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('storage')
        .setDescription(
            'Shows how much you have already used your backup storage'
        );
    public async run(context: Context) {
        let { message, locale } = context,
            { results } = await query(
                'SELECT (used) FROM user_storage WHERE id=?',
                [message.user.id]
            );

        if (results[0]) results = Number(results[0].used);
        else results = 0;

        let progressbar = filledBar(4194304, results);

        message.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(locale('commands:storage.title'))
                    .setDescription(
                        locale('commands:storage.value', {
                            used: ParseSize(results),
                            max: ParseSize(4194304),
                            bar: progressbar[0],
                            percentage: Math.floor(
                                Number(progressbar[1])
                            ).toFixed(2),
                        })
                    ),
            ],
        });
    }
}
