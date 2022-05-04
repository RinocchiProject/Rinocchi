import chalk from 'chalk';

class Log {
    public ok(message: string) {
        console.log(`${chalk.blueBright('>>')} ${chalk.whiteBright(message)}`);
    }
    public error(message: string) {
        console.log(`${chalk.red('Error:')} ${chalk.whiteBright(message)}`);
    }
}

export default Log;
