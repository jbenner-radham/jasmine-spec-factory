const AST        = require('./ast');
const chalk      = require('chalk');
const fs         = require('fs');
const Handlebars = require('handlebars');
const path       = require('path');
const pkg        = require('../package.json');

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

    let publicMembersDeclaration = ast.getPublicMembersDeclaration();
    let publicMembersDeclarator  = publicMembersDeclaration.declarations[0];
    let publicProperties         = publicMembersDeclarator.init.properties;
    let publicMethods            = publicProperties.filter(property => property.value.type === 'FunctionExpression');
    let publicMethodNames        = publicMethods.map(method => method.key.value).sort();
    let publicVars               = publicProperties.filter(property => property.value.type !== 'FunctionExpression');
    let publicVarNames           = [];

    if (publicVars.length >= 1) {
        publicVarNames = publicVars.map(publicVar => publicVar.key.value).sort();
    }

    let moduleSpecTemplate;
    let methodSpecPartial;
    let varSpecPartial;

    try {
        let templatesPath = path.join(__dirname, '..', 'templates');

        moduleSpecTemplate = fs.readFileSync(`${templatesPath}/moduleSpec.hbs`).toString();
        methodSpecPartial  = fs.readFileSync(`${templatesPath}/_methodSpec.hbs`).toString();
        varSpecPartial     = fs.readFileSync(`${templatesPath}/_varSpec.hbs`).toString();
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
