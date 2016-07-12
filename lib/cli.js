'use strict';
const program = require('commander');
const clean = require('./index');
const fs = require('fs');
const path = require('path');
const config = require('./config');

program
    .option('--debug', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('--base <dir>', 'Base directory with references')
    .option('-c, --config <config>', 'Path to gemini-clean config')
    .option('-r, --reference <dir...>', 'Path to gemini references to clean', (v) => v.split(','))
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','))
    .usage('<dir...>');

program.parse(process.argv);

if (program.config && fs.existsSync(program.config)) {
    let config = require(path.resolve(program.config));

    if (Array.isArray(config)) {
        config.forEach((check) => clean(check));
    } else {
        clean(config);
    }

    return;
}

let options = config({
    suites: program.args,
    references: program.reference,
    prepend: program.prepend,
    grep: program.grep,
    base: program.base,
    debug: program.debug
});

clean(options);
