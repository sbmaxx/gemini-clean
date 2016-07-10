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
