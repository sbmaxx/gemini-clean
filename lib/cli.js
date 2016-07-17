'use strict';
const program = require('commander');
const clean = require('./index');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_FILENAME = '.gemini-clean.js';

program
    .option('--debug', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('--base <dir>', 'Base directory with references')
    .option('-c, --config <config>', 'Path to gemini-clean config')
    .option('-r, --references <dir...>', 'Path to gemini references to clean', (v) => v.split(','))
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','))
    .usage('<dir...>');

program.parse(process.argv);

let config;

let options = {
    suites: program.args.length ? program.args : undefined,
    references: program.references,
    prepend: program.prepend,
    grep: program.grep,
    base: program.base,
    debug: program.debug
};

if (fs.existsSync(DEFAULT_CONFIG_FILENAME)) {
    config = require(path.resolve(DEFAULT_CONFIG_FILENAME));
} else if (program.config && fs.existsSync(program.config)) {
    // user passed config
    config = require(path.resolve(program.config));
}

if (!Array.isArray(config)) {
    config = [config];
}

config.forEach((config) => {
    // let user override config values from CLI
    clean(_.defaults(config, options));
});
