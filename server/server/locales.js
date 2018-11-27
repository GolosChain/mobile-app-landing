const fs = require('fs');
const path = require('path');

const IS_PROD = process.env.NODE_ENV === 'production';

const LOCALES = ['en', 'ru'];

const locales = {};

function loadLocales() {
    for (let lang of LOCALES) {
        locales[lang] = JSON.parse(
            fs.readFileSync(
                path.join(
                    __dirname,
                    `../../www/src/locales/${lang.toUpperCase()}.json`
                ),
                'utf-8'
            )
        );
    }
}

function getLocale(locale) {
    if (!IS_PROD) {
        // Если не на проде, то подтягивать локали из файлов всегда
        loadLocales();
    }

    return locales[locale];
}

loadLocales();

module.exports = {
    getLocale,
    localesList: LOCALES,
};
