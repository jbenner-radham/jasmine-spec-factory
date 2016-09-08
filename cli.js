#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const meow  = require('meow');
const pkg   = require('././package.json');

meow(`
    ${chalk.bold('Usage')}
        $ ${pkg.name} <filename>

    ${chalk.bold('Options')}
        --help, -h  Display this page.

    ${chalk.bold('Examples')}
        $ ${pkg.name} ~/path/to/an/amd/module.js
`, {
    alias: {
        h: 'help'
    }
});

require('./lib')();
