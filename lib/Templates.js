'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = class Templates {
    static get() {
        let templates = ['moduleSpec.hbs', '_methodSpec.hbs', '_varSpec.hbs'];

        return templates.map(Templates.getTemplate);
    }

    static getPath() {
        return path.join(__dirname, '..', 'templates');
    }

    static getTemplate(template) {
        let path = Templates.getPath();

        return fs.readFileSync(`${path}/${template}`).toString();
    }
};
