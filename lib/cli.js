'use strict';
const program = require('commander');
const assert = require('assert');
const clean = require('./index');

program
    .option('--debug <boolean>', 'Enable debug information')
    .option('--grep <grep>', 'Filter tests by regexp')
    .option('-b, --browser <browser>', 'Filter references by browser')
    .option('-c, --config <config>', 'Path to gemini config')
    .option('-r, --reference <dir>', 'Path to gemini references')
    .option('-p, --prepend <file...>', 'Prepend files', (v) => v.split(','), [])
    .usage('<dir...>');

program.parse(process.argv);

assert(program.args.length != 0, 'Pass directory with gemini suites');

clean(program.args, program);
