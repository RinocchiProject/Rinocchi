import Command from '../../core/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';
import {
    MessageActionRow,
    MessageSelectMenu,
    MessageEmbed,
    MessageAttachment,
} from 'discord.js';
import fs from 'fs';
import zlib from 'zlib';
import { exec } from 'child_process';
import { query } from '../../util/Database';

const Backup = require('discord-backup');

export default class backup extends Command {
    public name = 'backup';
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Make a server backup')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription('Sets how images will be saved')
                .setRequired(true)
                .addChoice('URL (CDN)', 'url')
                .addChoice('Base64', 'base64')
        )
        .addIntegerOption((option) =>
            option
                .setName('messages')
                .setRequired(true)
                .setDescription(
                    'Quantity (per channel) of messages to be saved'
                )
        );
    public run(context: Context) {
        let { client, locale, args, message } = context;
        if (!context.message.memberPermissions.has('MANAGE_GUILD')) {
            context.message.followUp(locale('errors:perm.manage_guild'));
            return;
        }
        Backup.setStorageFolder(process.cwd() + '/backups/');

        let row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('backupRemove')
                .setPlaceholder('Nothing selected')
                .setMinValues(1)
                .setMaxValues(4)
                .addOptions([
                    {
                        label: 'None',
                        description: 'Do not remove anything, full backup.',
                        value: 'none',
                    },
                    {
                        label: 'Roles',
                        description: "Don't save roles",
                        value: 'roles',
                    },
                    {
                        label: 'Bans',
                        description: "Don't save bans",
                        value: 'bans',
                    },
                    {
                        label: 'Channels',
                        description: "Don't save channels",
                        value: 'channels',
                    },
                    {
                        label: 'Emojis',
                        description: "Don't save emojis",
                        value: 'emojis',
                    },
                ])
        );
        message.followUp({
            content: locale('commands:backup.responses.delete'),
            components: [row],
        });
        client.handler.once('backupRemove', async (interaction: any) => {
            let removeArgs = [];
            if (interaction.values.includes('none')) removeArgs = [];
            else removeArgs = interaction.values;
            await interaction.editReply({
                content: locale('commands:backup.responses.upload.init'),
                components: [],
            });
            let info = await Backup.create(
                    client.guilds.cache.get(interaction.guildId),
                    {
                        maxMessagesPerChannel: Number(args[1] || 0),
                        jsonSave: true,
                        jsonBeautify: false,
                        doNotBackup: removeArgs,
                        saveImages: args[0],
                    }
                ),
                file = `${process.cwd()}/backups/${info.id}.json`;
            fs.createReadStream(file)
                .pipe(zlib.createGzip())
                .pipe(fs.createWriteStream(file + '.gz'))
                .on('finish', async () => {
                    fs.unlinkSync(file);
                    await interaction.editReply({
                        content: locale(
                            'commands:backup.responses.upload.send'
                        ),
                    });
                    exec(
                        `curl -F "file=@${file}.gz" "${client.settings.UPLOAD_URL}?token=${client.settings.UPLOAD_TOKEN}&name=${info.id}.json.gz"`,
                        async (err, stdout, _) => {
                            if (err) {
                                await interaction.editReply({
                                    content: locale(
                                        'commands:backup.responses.upload.err',
                                        {
                                            err: err.message,
                                        }
                                    ),
                                });
                                return;
                            }
                            let response = JSON.parse(stdout),
                                emb = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setDescription(
                                        locale(
                                            'commands:backup.responses.upload.ok',
                                            {
                                                id: info.id,
                                            }
                                        )
                                    );
                            await interaction.editReply({
                                content: ' ',
                                embeds: [emb],
                            });
                            await query('INSERT INTO backups VALUES (?, ?)', [
                                info.id,
                                response.url,
                            ]);
                            try {
                                await client.users.cache
                                    .get(interaction.user.id)
                                    .send({
                                        content: locale(
                                            'commands:backup.copy.msg'
                                        ),
                                        files: [
                                            new MessageAttachment(
                                                file + '.gz',
                                                `${info.id}.json.gz`
                                            ),
                                        ],
                                    });
                                fs.unlinkSync(file + '.gz');
                            } catch (err) {
                                let msg = await interaction.followUp({
                                    content: locale('commands:backup.copy.err'),
                                    files: [
                                        new MessageAttachment(
                                            file + '.gz',
                                            `${info.id}.json.gz`
                                        ),
                                    ],
                                });
                                msg.delete({ timeout: 120000 });
                                fs.unlinkSync(file + '.gz');
                            }
                        }
                    );
                });
        });
    }
}
