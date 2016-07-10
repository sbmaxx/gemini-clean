'use strict';
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

const Suite = require('./suite');
const TestAPI = require('./test-api');

module.exports = function(dirs, options) {

    if (options.prepend.length) {
        options.prepend.forEach((file) => require(path.resolve(file)));
    }

    let root = new Suite('');

    if (options.debug) {
        console.log('Searching for suites...');
    }
    _
        .chain(dirs)
        .map((dir) => dir.endsWith('.js') ? dir : glob.sync(path.join(dir, '**/*.js')))
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

    let suiteRefs = getSuiteRefs(root, [], path.resolve(options.base));

    if (options.debug) {
        console.log('References in suites:');
        suiteRefs
            .filter((ref) => options.grep ? ref.includes(options.grep) : true)
            .forEach((ref) => console.log(`  ${ref}`));
    }

    let fsRefs = getFsRefs(options.reference);
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
                let relRefPath = _.compact(suite.path).concat(state).join(path.sep);
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
                return _.map(glob.sync(path.join(dir, '**/*.png')), (ref) => {
                    return path.resolve(path.dirname(ref))
                });
            })
            .flatten()
            .uniq()
            .value();
    }
};
