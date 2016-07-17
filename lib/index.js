'use strict';
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

const Suite = require('./fake-gemini/suite');
const TestAPI = require('./fake-gemini/test-api');

const config = require('./config');

module.exports = function(options) {
    options = config(options);

    if (options.debug) {
        console.log('Options: ');
        _.forEach(options, (value, key) => {
            if (typeof value !== 'undefined') {
                console.log(`  ${key} = ${value}`)
            }
        });
    }

    if (options.prepend && options.prepend.length) {
        options.prepend.forEach((file) => require(path.resolve(file)));
    }

    // setup global variables
    if (options.globals) {
        _.forEach(options.globals, (value, key) => global[key] = value);
    }

    if (options.debug) {
        console.log('Searching for suites...');
    }

    let suites = findSuites();
    let root = new Suite('');

    _
        .chain(suites)
        .forEach((file) => options.debug && console.log(`  added ${file}`))
        .forEach((file) => {
            global.gemini = new TestAPI(root);
            require(file);
            delete global.gemini;
        })
        .value();

    // cleanup global variables
    if (options.globals) {
        _.forEach(options.globals, (value, key) => delete global[key]);
    }

    let suiteRefs = getSuiteRefs(root, [], path.resolve(options.base));

    if (options.debug) {
        console.log('References in suites:');
        suiteRefs
            .filter((ref) => options.grep ? ref.includes(options.grep) : true)
            .forEach((ref) => console.log(`  ${ref}`));
    }

    let fsRefs = getFsRefs(options.references);
    if (options.debug) {
        console.log('References at fs:');
        fsRefs
            .filter((ref) => options.grep ? ref.includes(options.grep) : true)
            .forEach((ref) => console.log(`  ${ref}`));
    }

    let diff = fsRefs.filter((ref) => !_.includes(suiteRefs, ref));

    if (diff.length === 0) {
        console.log('Hooray, all references are used');
    } else {
        console.log('Unused:');

        diff
            .filter((ref) => options.grep ? ref.includes(options.grep) : true)
            .forEach((ref) => console.log(`  ${ref}`));
    }

    function findSuites() {
        return _
            .chain(options.suites)
            .map((dir) => _.reduce(options.suiteMask, (files, mask) => files.concat(glob.sync(path.join(dir, mask))), []))
            .flatten()
            .compact()
            .map((file) => path.resolve(file))
            .uniq()
            .value();
    }

    function getSuiteRefs(suite, refs, base) {
        if (!suite.isRoot() && suite.states.length) {
            suite.states.forEach((state) => {
                let relRefPath = _.chain(suite.path).concat(state).compact().value().join(path.sep);
                refs.push(path.join(base, relRefPath));
            });
        }

        if (suite.childs) {
            suite.childs.forEach((suite) => getSuiteRefs(suite, refs, base));
        }

        return refs;
    }

    // @TODO: join with findSuites
    function getFsRefs(dirs) {
        return _
            .chain(dirs)
            .map((dir) => _.reduce(options.referenceMask, (files, mask) => files.concat(glob.sync(path.join(dir, mask))), []))
            .flatten()
            .map((ref) => path.resolve(path.dirname(ref)))
            .uniq()
            .value();
    }
};
