'use strict';
const program = require('commander');
const assert = require('assert');
const clean = require('./index');

program
    .option('--debug', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('-b, --browser <browser>', 'Filter references by browser')
    .option('-c, --config <config>', 'Path to gemini config')
    .option('-r, --reference <dir...>', 'Path to gemini references to clean', (v) => v.split(','), [])
    .option('--base <dir>', 'Base reference dir')
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','), [])
    .usage('<dir...>');

program.parse(process.argv);

assert(program.args.length !== 0, 'Pass directory with gemini suites');
assert(program.reference.length !== 0, 'Pass directory with gemini references');

// lets assume that this is the base directory?
if (program.reference.length === 1) {
    program.base = program.reference[0];
}

assert(program.base, 'Pass base directory for gemini references');

clean(program.args, program);
