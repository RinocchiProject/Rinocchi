import fetch from 'node-fetch';
import Command from '../../core/Command';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Context from '../../types/CommandContext';

export default class Manga extends Command {
    public name = 'manga';
    public dev = false;
    public data = new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Search data.mation from a manga')
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
            req = await fetch(
                `https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(
                    args[0]
                )}`
            ),
            data = (await req.json()).data[0].attributes,
            emb = new MessageEmbed()
                .setURL(`https://kitsu.io/manga/${data.slug}`)
                .setTitle(data.canonicalTitle)
                .setDescription(this.shorten(data.synopsis))
                .addField(locale('commands:anime.emb.stats'), data.status, true)
                .addField(
                    locale('commands:anime.emb.age'),
                    data.ageRatingGuide || data.ageRating || '???',
                    true
                )
                .addField(locale('commands:anime.emb.type'), data.subtype, true)
                .addField(
                    locale('commands:anime.emb.rating'),
                    data.averageRating,
                    true
                )
                .addField(
                    locale('commands:anime.emb.chapters.title'),
                    locale('commands:anime.emb.chapters.message', {
                        v: data.volumeCount || '???',
                        c: data.chapterCount || '???',
                    }),
                    true
                )
                .addField(
                    locale('commands:anime.emb.start'),
                    data.startDate
                        ? new Date(data.startDate).toLocaleDateString(
                              locale('commands:anime.date')
                          )
                        : '???'
                )
                .addField(
                    locale('commands:anime.emb.end'),
                    data.endDate
                        ? new Date(data.endDate).toLocaleDateString(
                              locale('commands:anime.date')
                          )
                        : '???',
                    true
                )
                .setColor('RANDOM')
                .setImage(data.posterImage ? data.posterImage.original : null);
        message?.followUp({ embeds: [emb] });
    }
}
