describe('Templates', function () {
    'use strict';

    const Templates = require('../lib/Templates');

    it('is a class', function () {
        expect(Templates).toEqual(jasmine.any(Function));
    });

    describe('get', function () {
        it('is a method', function () {
            expect(Templates.get).toEqual(jasmine.any(Function));
        });

        it('maps the `getTemplate` method to the `templates` array', function () {
            spyOn(Templates, 'getTemplate').and.callThrough();
            Templates.get();
            expect(Templates.getTemplate).toHaveBeenCalled();
        });

        it('returns an array', function () {
            expect(Templates.get()).toEqual(jasmine.any(Array));
        });
    });

    describe('getPath', function () {
        it('is a method', function () {
            expect(Templates.getPath).toEqual(jasmine.any(Function));
        });

        it('returns a string', function () {
            expect(Templates.getPath()).toEqual(jasmine.any(String));
        });
    });

    describe('getTemplate', function () {
        it('is a method', function () {
            expect(Templates.getTemplate).toEqual(jasmine.any(Function));
        });

        it('calls the `getPath` method', function () {
            spyOn(Templates, 'getPath').and.callThrough();
            Templates.get();
            expect(Templates.getPath).toHaveBeenCalled();
        });
    });
});
