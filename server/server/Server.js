const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const templates = require('./templates');
const { locales, localesList } = require('./locales');
const SubscriptionModel = require('./models/Subscription');

const DEFAULT_LANG = 'ru';

const HOST = process.env.GLS_SERVER_HOST || 'localhost';
const PORT = process.env.GLS_SERVER_PORT || 3000;

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
    async init() {
        mongoose.connect(process.env.GLS_MONGO_CONNECT).catch(err => {
            console.error('MongoDB connect failed:', err);
        });

        const app = express();

        app.use(cookieParser());
        app.use(express.json());

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

        app.post('/subscribe', this.handleSubscribe.bind(this));

        app.use(express.static(path.join(__dirname, '../../www/build')));

        return new Promise((resolve, reject) => {
            app.listen(
                {
                    host: HOST,
                    port: PORT,
                },
                err => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(
                            `Landing backend listening at ${HOST}:${PORT}!`
                        );
                        resolve();
                    }
                }
            );
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

    async handleSubscribe(req, res) {
        const email = req.body.email;

        if (!email) {
            res.statusCode = 400;
            res.json({
                error: 'Invalid input',
            });
            return;
        }

        try {
            await new SubscriptionModel({
                email,
                stamp: new Date(),
            }).save();
        } catch (err) {
            console.error('MongoDB insertion failed:', err);

            res.statusCode = 500;
            res.json({
                error: 'Internal error',
            });
            return;
        }

        res.json({
            status: 'ok',
        });
    }
}

module.exports = Server;
