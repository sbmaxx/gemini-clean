'use strict';
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

const Suite = require('./fake-gemini/suite');
const TestAPI = require('./fake-gemini/test-api');

const config = require('./config');

module.exports = function(options) {

    options = config(options);

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

    let root = new Suite('');

    _
        .chain(options.suites)
        .map((dir) => {
            if (dir.endsWith('.js')) { return dir }

            var ret = [].concat(glob.sync(path.join(dir, '**/*.js~')));

            ret = ret.concat(glob.sync(path.join(dir, options.suiteMask)));

            return ret;
        })
        .flatten()
        .compact()
        .map((file) => path.resolve(file))
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

    function getFsRefs(dirs) {
        return _
            .chain(dirs)
            .map((dir) => {
                return _.map(glob.sync(path.join(dir, options.referenceMask)), (ref) => {
                    return path.resolve(path.dirname(ref))
                });
            })
            .flatten()
            .uniq()
            .value();
    }
};
