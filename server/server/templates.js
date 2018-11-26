const pug = require('pug');
const path = require('path');

const templates = {
    index: pug.compileFile(path.join(__dirname, '../../www/templates/index.pug')),
};

module.exports = {
    render(templateName, params) {
        return templates[templateName](params);
    },
};
