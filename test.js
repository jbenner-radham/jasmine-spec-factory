'use strict';

const expect             = require('chai').expect;
const jasmineSpecFactory = require('./');

describe('Jasmine Spec Factory', function () {
    it('is a function', function () {
        expect(jasmineSpecFactory).to.be.a('function');
    });
});
