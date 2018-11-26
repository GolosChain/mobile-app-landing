const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const templates = require('./templates');
const { locales, localesList } = require('./locales');

const DEFAULT_LANG = 'ru';

const port = 3000;

function checkLang(lang) {
    return locales[lang] ? lang : null;
}

function extractLang(langString) {
    if (!langString) {
        return;
    }

    const langStrings = langString.split(',');

    for (let langString of langStrings) {
        const langCode = langString.split(';')[0];

        const lang = langCode.match(/^[a-z]+/i)[0].toUpperCase();

        if (checkLang(lang)) {
            return lang;
        }
    }
}

class Server {
    init() {
        return new Promise(resolve => {
            const app = express();

            app.use(cookieParser());

            app.get('/en/', (...args) => this.handleRequest('en', ...args));
            app.get('/ru/', (...args) => this.handleRequest('ru', ...args));

            app.get('/', (req, res) => {
                let lang = checkLang(req.cookies['gls.lang']);

                if (!lang) {
                    lang = extractLang(req.headers['accept-language']);
                }

                if (!lang) {
                    lang = DEFAULT_LANG;
                }

                this.handleRequest(lang, req, res);
            });

            app.use(express.static(path.join(__dirname, '../../www/build')));

            app.listen(port, () => {
                console.log(`Landing backend listening on port ${port}!`);
                resolve();
            });
        });
    }

    handleRequest(lang, req, res) {
        try {
            res.send(
                templates.render('index', {
                    ...locales[lang],
                    localesList: localesList,
                    locale: lang,
                })
            );
        } catch (err) {
            console.error('Error while request processing:', err);
            res.send(500, '500 - Internal error');
        }
    }
}

module.exports = Server;
