import Command from '../../core/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';
import Fetch from 'node-fetch';
import getUser from '../../util/getUser';
import { MessageAttachment } from 'discord.js';
import ImageUtil from '../../util/ImageUtils';

export default class PatPat extends Command {
    public name = 'patpat';
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('patpat')
        .setDescription('Pet-pet Time')
        .addNumberOption((option) =>
            option
                .setName('delay')
                .setDescription(
                    'Smaller is faster and bigger is slower. Minimum is 4.'
                )
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Pat an user')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('Pat a image')
                .setRequired(false)
        );
    public async run(context: Context) {
        let { client, rawOptions, locale, message } = context,
            config = {
                user:
                    rawOptions.find((x) => x.name == 'user')?.value ||
                    message.user.id,
                image: rawOptions.find((x) => x.name == 'url')?.value,
                delay: rawOptions.find((x) => x.name == 'delay')?.value || 20,
            },
            Image = new ImageUtil();
        if (typeof config.image == 'string') {
            let req = await Fetch(config.image);
            if (!req.ok) {
                message.followUp(locale('commands:petpet.loadError'));
                return;
            }
        }
        Image.GifPetPet(
            config.image ||
                (await getUser.avatar(
                    config.user,
                    2048,
                    client.settings.TOKEN
                )),
            { delay: config.delay }
        )
            .then((img) => {
                message.followUp({
                    files: [new MessageAttachment(img, 'patpat.gif')],
                });
            })
            .catch((err) => {
                message.followUp(
                    locale('commands:petpet.err', { err: err.message })
                );
            });
    }
}
