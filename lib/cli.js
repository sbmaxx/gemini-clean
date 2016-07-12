'use strict';
const program = require('commander');
const clean = require('./index');
const fs = require('fs');
const path = require('path');

program
    .option('--debug', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('--base <dir>', 'Base directory with references')
    .option('-c, --config <config>', 'Path to gemini-clean config')
    .option('-r, --reference <dir...>', 'Path to gemini references to clean', (v) => v.split(','), [])
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','), [])
    .usage('<dir...>');

program.parse(process.argv);

console.log(program.config);

if (program.config && fs.existsSync(program.config)) {
    let config = require(path.resolve(program.config));

    if (Array.isArray(config)) {
        config.forEach((check) => clean(check));
    } else {
        clean(config);
    }

    return;
}

if (program.args.length === 0) {
    console.warn('Pass directory with gemini suites');
    process.exit(0);
}
if (program.reference.length === 0) {
    console.warn('Pass directory with gemini references');
    process.exit(0);
}

clean({
    suites: program.args,
    references: program.reference,
    prepend: program.prepend,
    grep: program.grep,
    base: program.base,
    debug: options.debug
});
