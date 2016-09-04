describe('AST', function () {
    'use strict';

    const module = require('../../lib/ast');

    it('is a function', function () {
        expect(module).toEqual(jasmine.any(Function));
    });
});
