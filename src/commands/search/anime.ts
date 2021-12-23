import fetch from 'node-fetch';
import Command from '../../core/Command';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';

export default class Anime extends Command {
    public name = 'anime';
    public aliases = [];
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Search for information about an anime')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search Argument')
                .setRequired(true)
        );
    private shorten(text: string, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }
    public async run(context: Context) {
        let { message, args, locale } = context,
            data: any = await fetch(
                `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
                    args[0]
                )}`
            ),
            info = (await data.json()).data[0].attributes,
            emb = new MessageEmbed()
                .setTitle(info.canonicalTitle)
                .setColor('RANDOM')
                .setURL(`https://kitsu.io/anime/${info.slug}`)
                .setImage(info.posterImage ? info.posterImage.original : null)
                .addField(locale('commands:anime.emb.stats'), info.status, true)
                .addField(
                    locale('commands:anime.emb.age'),
                    info.ageRatingGuide,
                    true
                )
                .addField(locale('commands:anime.emb.type'), info.subtype, true)
                .addField(
                    locale('commands:anime.emb.rating'),
                    info.averageRating,
                    true
                )
                .addField(
                    locale('commands:anime.emb.start'),
                    info.startDate
                        ? new Date(info.startDate).toLocaleDateString(
                              locale('commands:anime.date')
                          )
                        : '???'
                )
                .addField(
                    locale('commands:anime.emb.end'),
                    info.endDate
                        ? new Date(info.endDate).toLocaleDateString(
                              locale('commands:anime.date')
                          )
                        : '???',
                    true
                )
                .setDescription(this.shorten(info.description));
        message?.followUp({ embeds: [emb] });
    }
}
