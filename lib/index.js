'use strict';
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

module.exports = function(dirs, options) {
    let gemini = {
        suite: (name, fn) => {
            console.log(`suite — ${name}`);

            fn.call(this, gemini);

            return gemini;
        },
        setUrl: () => gemini,
        setCaptureElements: () => gemini,
        capture: () => gemini
    };

    global.gemini = gemini;
    global.getURL = function() {};
    global.PO = {
        serpListSearch: {
            serpItemExternal: function() {},
            serpItem: {
                player: function() {}
            }
        }
    };

    _.chain(dirs)
        .map((dir) => dir.endsWith('.js') ? dir : glob.sync(path.join(dir, '**/*.js')))
        .flatten()
        .map((file) => path.resolve(file))
        .forEach((file) => console.log(file))
        .forEach((file) => require(file))
        .value();
};
