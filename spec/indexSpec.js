describe('Jasmine Spec Factory', function () {
    'use strict';

    const module = require('../');

    it('is a function', function () {
        expect(module).toEqual(jasmine.any(Function));
    });
});
