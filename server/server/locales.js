const fs = require('fs');
const path = require('path');

const LANGS = ['en', 'ru'];

const locales = {};

for (let lang of LANGS) {
    locales[lang] = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                `../../www/locales/${lang.toUpperCase()}.json`
            ),
            'utf-8'
        )
    );
}

module.exports = {
    locales,
    localesList: LANGS,
};
