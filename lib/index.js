const AST        = require('./ast');
const chalk      = require('chalk');
const fs         = require('fs');
const Handlebars = require('handlebars');
const pkg        = require('../package.json');
const Templates  = require('./Templates');

module.exports = function () {
    'use strict';

    let filename = process.argv[2];
    let moduleName;
    let source;

    if (!filename) {
        console.error(chalk.red('A filename argument is required.'));
        process.exit(1);
    }

    try {
        source = fs.readFileSync(filename).toString();
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }

    let ast = new AST(source);

    if (!ast.hasPublicMembersDeclaration()) {
        console.error(chalk.red('The AMD module you are parsing does not appear to have a `publicMembers` variable.'));
        console.error(chalk.red(`If you believe this to be an error, please report it at: <${pkg.bugs.url}>.`));
        process.exit(1);
    }

    try {
        moduleName = source.match(/ @exports ([\w\/]+)/).slice(1, 2).shift();
    } catch (_) {
        // Do nothing.
    }

    let publicMethodNames = ast.getPublicMethodNames();
    let publicVarNames    = ast.getPublicVarNames();

    let moduleSpecTemplate;
    let methodSpecPartial;
    let varSpecPartial;

    try {
        let templates = Templates.get();

        moduleSpecTemplate = templates.shift();
        methodSpecPartial  = templates.shift();
        varSpecPartial     = templates.shift();
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }

    let moduleSpecView = Handlebars.compile(moduleSpecTemplate);
    let methods        = publicMethodNames.map(methodName => {
        return {name: methodName};
    });
    let vars           = publicVarNames.map(varName => {
        return {name: varName};
    });
    let context        = {methods: methods, moduleName: moduleName, vars: vars};

    Handlebars.registerPartial('methodSpec', methodSpecPartial);
    Handlebars.registerPartial('varSpec', varSpecPartial);

    return console.log(moduleSpecView(context));
};
