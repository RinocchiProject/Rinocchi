export default interface GlobalProps {
    // Mysql
    DATABASE: string;
    USERNAME: string;
    PASSWORD: string;
    HOST: string;
    PORT: string;
    // Bot
    TOKEN: string;
    OWNER: string;
    PREFIX: string;
    // Env
    DEV: string;
}
