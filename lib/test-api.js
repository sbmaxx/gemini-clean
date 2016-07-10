'use strict';

const Suite = require('./suite');
const SuiteBuilder = require('./suite-builder');

class TestAPI {
    constructor(suite) {
        this._suite = suite;
    }

    suite(name, callback) {

        this._suite = new Suite(name, this._suite);

        callback(new SuiteBuilder(this._suite));
    }
}

module.exports = TestAPI;
