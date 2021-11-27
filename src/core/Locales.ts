import i18next from 'i18next';
import translationBackend from 'i18next-node-fs-backend';
import { readdirSync } from 'fs';

class Lang {
    private main: string[];
    private folders: string[];
    constructor() {
        this.main = ['pt-BR'];
        this.folders = ['errors', 'commands'];
    }
    async load(language: string) {
        let locale;
        function setFixed(translate) {
            locale = translate;
        }
        setFixed(i18next.getFixedT(language));
        return locale;
    }
    async init() {
        i18next.use(translationBackend).init({
            ns: this.folders,
            preload: readdirSync('./locales/'),
            fallbackLng: 'pt-BR',
            backend: {
                loadPath: './locales/{{lng}}/{{ns}}.json',
            },
            interpolation: {
                escapeValue: false,
            },
            returnEmptyString: false,
        });
    }
}

export default Lang;
