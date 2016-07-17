'use strict';
const program = require('commander');
const clean = require('./index');

program
    .option('--debug', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('--base <dir>', 'Base directory with references')
    .option('-c, --config <config>', 'Path to gemini-clean config')
    .option('-r, --references <dir...>', 'Path to gemini references to clean', (v) => v.split(','))
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','))
    .usage('<dir...>');

program.parse(process.argv);

clean({
    suites: program.args.length ? program.args : undefined,
    references: program.references,
    prepend: program.prepend,
    grep: program.grep,
    base: program.base,
    debug: program.debug,
    config: program.config
});
