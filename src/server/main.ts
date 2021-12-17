import express from 'express';
import chalk from 'chalk';
import Client from '../core/Client';

// routes
import GuildInfo from './routes/GuildInfo';

export default function (client: Client) {
    const app = express();

    app.get(GuildInfo.route, new GuildInfo(client).handle);

    app.listen(process.env.PORT || 8080, () =>
        console.log(`${chalk.hex('#d654c3')('[API]')}: Online`)
    );
}
