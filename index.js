const acorn = require('acorn');
const fs    = require('fs');

module.exports = function () {
	'use strict';

	let filename = process.argv[2];
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

	/*
	let publicMembersToken = Array.from(acorn.tokenizer(source))
	                          .filter(token => token.value === 'publicMembers')
							  .shift();

	let expression = acorn.parseExpressionAt(source, publicMembersToken.start);
	*/


	let ast                      = acorn.parse(source);
	let module                   = ast.body[0].expression.arguments.filter(argument => argument.type === 'FunctionExpression')[0];
	let moduleBlockStatement     = module.body;
	let variableDeclarations     = moduleBlockStatement.body.filter(token => token.type === 'VariableDeclaration');
	let publicMembersDeclaration = variableDeclarations.filter(declaration => declaration.declarations.filter(declarator => declarator.id.name === "publicMembers").length === 1)[0];
	let publicMembersDeclarator  = publicMembersDeclaration.declarations[0];
	let publicProperties         = publicMembersDeclarator.init.properties;
	let publicMethods            = publicProperties.filter(property => property.value.type === 'FunctionExpression');
	let publicMethodNames        = publicMethods.map(method => method.key.value).sort();

	console.info(JSON.stringify(publicMethodNames, null, 4));

	return;

	//console.info(JSON.stringify(blockStatement, null, 4));

	try {
		//ast                  = acorn.parse(source);
		//module               = ast.body[0].expression.arguments.filter(argument => argument.type === 'FunctionExpression')[0];
		//blockStatement       = module.body;
		//variableDeclarations = blockStatement.body.filter(declaration => declaration.type === 'VariableDeclaration' && declaration.id && declaration.id.name === 'publicMembers')[0];
		//publicMembers        = variableDeclarations.declarations.filter(declaration => declaration.id.name === 'publicMembers')[0];
	} catch (error) {
		console.error("Cannot find `publicMembers` variable.", error);
		process.exit(1);
	}

	//console.info(JSON.stringify(variableDeclarations, null, 4));
	//process.exit(0);

	let properties           = publicMembers.init.properties.filter(property => property.value.type !== 'FunctionExpression');
	let methods              = publicMembers.init.properties.filter(property => property.value.type === 'FunctionExpression');
	let moduleName           = source.match(/ @exports ([\w\/]+)/).slice(1, 2).shift();
	let propertyNames        = properties.map(property => property.key.value).sort();
	let methodNames          = methods.map(method => method.key.value).sort();

	let head = `define(["${moduleName}"], function (module) {` + "\n" +
		"\t" + `"use strict"` + "\n";

	let specs = methodNames.map(methodName => {
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
