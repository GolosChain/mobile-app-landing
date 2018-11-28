const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const templates = require('./templates');
const { getLocale, localesList } = require('./locales');
const SubscriptionModel = require('./models/Subscription');

const DEFAULT_LANG = 'ru';

const HOST = process.env.GLS_SERVER_HOST || 'localhost';
const PORT = process.env.GLS_SERVER_PORT || 3000;

process.on('unhandledRejection', err => {
    console.log('Caught unhandled rejection: ', err);
});

process.on('uncaughtException', err => {
    console.log('Caught exception: ', err);
});

function extractLang(langString) {
    if (!langString) {
        return;
    }

    const langStrings = langString.split(',');

    for (let langString of langStrings) {
        const langCode = langString.split(';')[0];

        const lang = langCode.match(/^[a-z]+/i)[0].toUpperCase();

        if (localesList.includes(lang)) {
            return lang;
        }
    }
}

class Server {
    async init() {
        const app = express();

        app.use(cookieParser());
        app.use(express.json());
        app.use(helmet());

        app.get('/en/', (...args) => this.handleRequest('en', ...args));
        app.get('/ru/', (...args) => this.handleRequest('ru', ...args));

        app.get('/', (req, res) => {
            let lang = req.cookies['gls.lang'];

            if (!localesList.includes(lang)) {
                lang = null;
            }

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
                        const env = process.env.NODE_ENV || 'development';

                        console.log(
                            `Environment: ${env}\n` +
                                `Landing backend listening at ${HOST}:${PORT}!`
                        );
                        resolve();

                        this.tryConnectToMongo();
                    }
                }
            );
        });
    }

    handleRequest(lang, req, res) {
        try {
            res.send(
                templates.render('index', {
                    ...getLocale(lang),
                    localesList: localesList,
                    locale: lang,
                })
            );
        } catch (err) {
            console.error('Error while request processing:', err);
            res.statusCode = 500;
            res.send('500 - Internal server error');
        }
    }

    async handleSubscribe(req, res) {
        const { email, wantTest, wantMessage } = req.body;

        if (!email || (!wantTest && !wantMessage)) {
            res.statusCode = 400;
            res.json({ error: 'Invalid input' });
            return;
        }

        if (typeof wantTest !== 'boolean' || typeof wantMessage !== 'boolean') {
            res.statusCode = 400;
            res.json({ error: 'Invalid input' });
            return;
        }

        try {
            await SubscriptionModel.findOneAndUpdate(
                { email: req.body.email },
                {
                    email: req.body.email,
                    wantTest,
                    wantMessage,
                    stamp: new Date(),
                },
                { new: true, upsert: true }
            );
        } catch (err) {
            console.error('MongoDB insertion failed:', err);

            res.statusCode = 500;
            res.json({
                error: 'Internal server error',
            });
            return;
        }

        res.json({
            status: 'ok',
        });
    }

    tryConnectToMongo() {
        const connectString =
            process.env.GLS_MONGO_CONNECT || 'mongodb://localhost/landing';

        mongoose
            .connect(
                connectString,
                { useNewUrlParser: true }
            )
            .catch(err => {
                console.error('MongoDB', err.message);
            });
    }
}

module.exports = Server;
