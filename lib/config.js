'use strict';
const _ = require('lodash');
const path = require('path');

const DEFAULT_CONFIG = {
    references: ['gemini/references'],
    suites: ['gemini'],
    base: 'gemini/references',
    suiteMask: ['**/*.js'],
    referenceMask: ['**/*.png']
};

module.exports = function(options) {
    // fill with defaults
    options = _.defaults(options, DEFAULT_CONFIG);

    if (!path.isAbsolute(options.base)) {
        options.base = path.resolve(options.base);
    }

    options.suites = options.suites.map((dir) => {
        if (!path.isAbsolute(dir)) {
            return path.resolve(dir);
        }
        return dir;
    });

    options.references = options.references.map((dir) => {
        if (!path.isAbsolute(dir)) {
            return path.resolve(dir);
        }
        return dir;
    });

    return options;
};
