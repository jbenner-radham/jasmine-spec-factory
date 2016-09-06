describe('AST', function () {
    'use strict';

    const AST = require('../../lib/ast');

    it('is a class', function () {
        expect(AST).toEqual(jasmine.any(Function));
    });

    describe('getBody', function () {
        it('is a method', function () {
            expect(AST.prototype.getBody).toEqual(jasmine.any(Function));
        });
    });

    describe('getPublicMembersDeclaration', function () {
        it('is a method', function () {
            expect(AST.prototype.getPublicMembersDeclaration).toEqual(jasmine.any(Function));
        });
    });

    describe('getVariableDeclarations', function () {
        it('is a method', function () {
            expect(AST.prototype.getVariableDeclarations).toEqual(jasmine.any(Function));
        });
    });

    describe('hasPublicMembersDeclaration', function () {
        it('is a method', function () {
            expect(AST.prototype.hasPublicMembersDeclaration).toEqual(jasmine.any(Function));
        });
    });
});
