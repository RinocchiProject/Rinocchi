import Client from '../core/Client';
import Event from '../core/Event';
import { query } from '../util/Database';
import Command from '../core/Command';
import { Interaction } from 'discord.js';
import Context from '../types/CommandContext';

export default class InteractionEvent extends Event {
    public name: string = 'interactionCreate';
    private async fetchUserLang(id: string, client: Client): Promise<string> {
        if (client.temp.has(`lang.${id}`)) {
            return client.temp.get(`lang.${id}`);
        } else {
            let { results } = await query(
                `SELECT (lang) FROM user_lang WHERE id=?`,
                [`${id}`]
            );
            if (typeof results[0] == 'undefined') {
                client.temp.set(`lang.${id}`, 'pt-BR');
                return 'pt-BR';
            }
            client.temp.set(`lang.${id}`, results[0].lang);
            return results[0].lang;
        }
    }
    public async run(client: Client, interaction: Interaction) {
        if (!interaction.isCommand()) return;
        let userLang = await this.fetchUserLang(interaction.user.id, client),
            Locale = await client.lang.load(userLang),
            args = [];
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const command: Command = client.commands.findByName(
            interaction.commandName
        );
        if (!command)
            interaction.followUp(
                Locale('errors:command.unknow', {
                    name: interaction.commandName,
                })
            );
        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        if (
            command.dev == true &&
            interaction.user.id !== client.settings.OWNER
        )
            return;
        console.log(interaction.user);
        console.log(Locale);
        console.log(args);
        command.run(new Context(client, interaction, args, Locale));
    }
}
