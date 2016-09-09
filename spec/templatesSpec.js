describe('templates', function () {
    'use strict';

    const templates = require('../lib/Templates');

    it('is a class', function () {
        expect(templates).toEqual(jasmine.any(Function));
    });

    describe('get', function () {
        it('is a method', function () {
            expect(templates.get).toEqual(jasmine.any(Function));
        });

        it('maps the `getTemplate` method to the `templates` array', function () {
            spyOn(templates, 'getTemplate').and.callThrough();
            templates.get();
            expect(templates.getTemplate).toHaveBeenCalled();
        });

        it('returns an array', function () {
            expect(templates.get()).toEqual(jasmine.any(Array));
        });
    });

    describe('getPath', function () {
        it('is a method', function () {
            expect(templates.getPath).toEqual(jasmine.any(Function));
        });

        it('returns a string', function () {
            expect(templates.getPath()).toEqual(jasmine.any(String));
        });
    });

    describe('getTemplate', function () {
        it('is a method', function () {
            expect(templates.getTemplate).toEqual(jasmine.any(Function));
        });

        it('calls the `getPath` method', function () {
            spyOn(templates, 'getPath').and.callThrough();
            templates.get();
            expect(templates.getPath).toHaveBeenCalled();
        });
    });
});
