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
    let publicVars               = publicProperties.filter(property => property.value.type !== 'FunctionExpression');
    let publicVarNames;
    let vars;

    if (publicVars.length >= 1) {
        publicVarNames = publicVars.map(publicVar => publicVar.key.value).sort();
    }

    let header = `define(["${moduleName}"], function (module) {` + "\n" +
        "\t" + `"use strict";` + "\n" +
        "\n" +
        "\t" + `describe("${moduleName}", function () {`;

    if (publicVarNames) {
        vars = publicVarNames.map(varName => {
            return "\t\t" + `it("has a property named \\"${varName}\\"", function () {` + "\n" +
                "\t\t\t" + `expect(module.${varName}).toBeDefined();` + "\n" +
                "\t\t});";
        });
    }

    let specs = publicMethodNames.map(methodName => {
        return "\t\t" + `describe("${methodName}", function () {` + "\n" +
            "\t\t\tit(\"is a function\", function () {\n" +
            "\t\t\t\t" + `expect(module.${methodName}).toEqual(jasmine.any(Function));` + "\n" +
            "\t\t\t});\n" +
            "\t\t});";
    });

    let footer = "\t});\n" +
        "});";

    console.log(header);

    if (publicVarNames) {
        console.log(vars.join("\n\n") + "\n");
    }

    console.log(specs.join("\n\n"));
    console.log(footer);
};
