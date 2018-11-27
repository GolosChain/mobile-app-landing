const pug = require('pug');
const path = require('path');

const IS_PROD = process.env.NODE_ENV === 'production';

const templates = {
    index: pug.compileFile(
        path.join(__dirname, '../../www/src/templates/index.pug')
    ),
};

module.exports = {
    render(templateName, params) {
        if (!templates[templateName]) {
            throw new Error('Invalid template name');
        }

        if (IS_PROD) {
            return templates[templateName](params);
        } else {
            return pug.compileFile(
                path.join(__dirname, `../../www/src/templates/${templateName}.pug`)
            )(params);
        }
    },
};
