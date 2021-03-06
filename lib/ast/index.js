'use strict';

const acorn = require('acorn');

module.exports = class AST {
    constructor(source) {
        this.ast = acorn.parse(source);
    }

    getBody() {
        return this.ast.body[0];
    }

    getModule() {
        let body = this.getBody();

        return body.expression.arguments.filter(AST.isFunctionExpression)[0];
    }

    getPublicMembersDeclaration() {
        if (!this.hasPublicMembersDeclaration()) {
            return '';
        }

        let variableDeclarations      = this.getVariableDeclarations();
        let publicMembersDeclarations = variableDeclarations.filter(AST.isPublicMembersDeclaration);

        return publicMembersDeclarations.shift();
    }

    getPublicMembersDeclarator() {
        let publicMembersDeclaration = this.getPublicMembersDeclaration();

        if (!publicMembersDeclaration) {
            return '';
        }

        return publicMembersDeclaration.declarations[0];
    }

    getPublicMethodNames() {
        let publicMethods = this.getPublicMethods();

        return publicMethods.map(AST.getKeyValue).sort();
    }

    getPublicMethods() {
        let publicProperties = this.getPublicProperties();

        return publicProperties.filter(AST.isValueFunctionExpression);
    }

    getPublicProperties() {
        let publicMembersDeclarator = this.getPublicMembersDeclarator();

        return publicMembersDeclarator.init.properties;
    }

    getPublicVarNames() {
        let publicVars = this.getPublicVars();

        return publicVars.map(AST.getKeyValue).sort();
    }

    getPublicVars() {
        let publicProperties = this.getPublicProperties();

        return publicProperties.filter(AST.isValueNotFunctionExpression);
    }

    getVariableDeclarations() {
        let module         = this.getModule();
        let blockStatement = module.body;

        return blockStatement.body.filter(AST.isVariableDeclaration);
    }

    hasPublicMembersDeclaration() {
        let variableDeclarations      = this.getVariableDeclarations();
        let publicMembersDeclarations = variableDeclarations.filter(AST.isPublicMembersDeclaration);

        return (publicMembersDeclarations.length !== 0);
    }

    static getKeyValue(token) {
        return token.key.value;
    }

    static isFunctionExpression(token) {
        return token.type === 'FunctionExpression';
    }

    static isPublicMembersDeclarator(token) {
        if (!token.id || !token.id.name) {
            return false;
        }

        return token.id.name === 'publicMembers';
    }

    static isPublicMembersDeclaration(token) {
        if (!token.declarations) {
            return false;
        }

        return (token.declarations.filter(AST.isPublicMembersDeclarator).length === 1);
    }

    static isValueFunctionExpression(token) {
        return token.value.type === 'FunctionExpression';
    }

    static isValueNotFunctionExpression(token) {
        return token.value.type !== 'FunctionExpression';
    }

    static isVariableDeclaration(token) {
        return token.type === 'VariableDeclaration';
    }
};
