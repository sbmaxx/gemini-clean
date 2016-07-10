'use strict';
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

class TestAPI {
    constructor(suite) {
        this._suite = suite;
    }

    suite(name, callback) {

        this._suite = new Suite(name, this._suite);

        callback(new SuiteBuilder(this._suite));
    }
}

class Suite {
    constructor(name, parent) {
        this.name = name;
        this.path = [name];

        this.states = [];
        this.childs = [];

        if (parent) {
            this.parent = parent;
            this.path = parent.path.concat(name);

            parent.addChild(this);
        }
    }

    addChild(suite) {
        this.childs.push(suite);
    }

    addState(name) {
        this.states.push(name);
    }

    isRoot() {
        return !this.parent;
    }

    fullName() {
        return this.isRoot()
            ? this.name
            : _.compact([this.parent.fullName(), this.name]).join('/');
    }
}

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

module.exports = function(dirs, options) {

    if (options.prepend.length) {
        options.prepend.forEach((file) => require(path.resolve(file)));
    }

    let root = new Suite('root');

    console.log('Searching for suites...');
    _
        .chain(dirs)
        .map((dir) => dir.endsWith('.js') ? dir : glob.sync(path.join(dir, '**/*.js')))
        .flatten()
        .map((file) => path.resolve(file))
        .forEach((file) => console.log(`  added ${file}`))
        .forEach((file) => {
            global.gemini = new TestAPI(root);
            require(file);
            delete global.gemini;
        })
        .value();

    console.log('');
    suiteLogger(root, 0);

    function suiteLogger(suite) {
        console.log(suite.fullName());

        if (suite.states.length) {
            suite.states.forEach((state) => console.log(`  ${state}`));
        }

        if (suite.childs) {
            suite.childs.forEach((suite) => suiteLogger(suite));
        }
    }
};
