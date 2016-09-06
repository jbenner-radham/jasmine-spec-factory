describe('jasmine-spec-factory', function () {
    'use strict';

    const module = require('../lib');

    it('is a function', function () {
        expect(module).toEqual(jasmine.any(Function));
    });
});
