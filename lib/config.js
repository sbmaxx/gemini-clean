'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const DEFAULT_CONFIG_FILENAME = '.gemini-clean.js';
const DEFAULT_CONFIG = {
    references: ['gemini/references'],
    suites: ['gemini'],
    base: 'gemini/references',
    suiteMask: ['**/*.js'],
    referenceMask: ['**/*.png']
};

module.exports = function(options) {
    let config;

    if (fs.existsSync(DEFAULT_CONFIG_FILENAME)) {
        config = require(path.resolve(DEFAULT_CONFIG_FILENAME));
    } else if (options.config && fs.existsSync(options.config)) {
        // user passed config
        config = require(path.resolve(options.config));
    }

    // let him override config values from CLI
    options = _.defaults(config, options);
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
