'use strict';

class SuiteBuilder {
    constructor(suite) {
        this.suite = suite;
    }

    capture(state) {
        this.suite.addState(state);
        return this
    }

    setUrl(url) {
        return this;
    }

    setCaptureElements(selector) {
        return this;
    }

    ignoreElements(selector) {
        return this;
    }

    setTolerance() {
        return this;
    }

    skip() {
        return this;
    }

    browsers() {
        return this;
    }

    before() {
        return this;
    }
}

module.exports = SuiteBuilder;
