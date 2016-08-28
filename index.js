const acorn = require('acorn');
const fs    = require('fs');

module.exports = function () {
    'use strict';

    let filename = process.argv[2];
    let moduleName;
    let source;

    if (!filename) {
        console.error('A filename argument is required.');
        process.exit(1);
    }

    try {
        source = fs.readFileSync(filename).toString();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        moduleName = source.match(/ @exports ([\w\/]+)/).slice(1, 2).shift();
    } catch (_) {
        // Do nothing.
    }

    let ast                      = acorn.parse(source);
    let module                   = ast.body[0].expression.arguments.filter(argument => argument.type === 'FunctionExpression')[0];
    let moduleBlockStatement     = module.body;
    let variableDeclarations     = moduleBlockStatement.body.filter(token => token.type === 'VariableDeclaration');
    let publicMembersDeclaration = variableDeclarations.filter(declaration => declaration.declarations.filter(declarator => declarator.id.name === "publicMembers").length === 1)[0];
    let publicMembersDeclarator  = publicMembersDeclaration.declarations[0];
    let publicProperties         = publicMembersDeclarator.init.properties;
    let publicMethods            = publicProperties.filter(property => property.value.type === 'FunctionExpression');
    let publicMethodNames        = publicMethods.map(method => method.key.value).sort();

    let head = `define(["${moduleName}"], function (module) {` + "\n" +
        "\t" + `"use strict"` + "\n";

    let specs = publicMethodNames.map(methodName => {
        let methodSpec = "\t" + `describe("${methodName}", function () {` + "\n" +
            "\t\tit(\"is a function\", function () {\n" +
            "\t\t\t" + `expect(module.${methodName}).toEqual(jasmine.any(Function));` + "\n" +
            "\t\t});\n" +
            "\t});";

        return methodSpec;
    });

    let foot = "});";

    console.log(head);
    console.log(specs.join("\n\n"));
    console.log(foot);
};
