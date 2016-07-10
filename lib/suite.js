'use strict';
const _ = require('lodash');

class Suite {
    constructor(name, parent) {
        this.name = name;
        this.path = [name];

        this.states = [];
        this.childs = [];

        if (parent) {
            this.parent = parent;
            this.path = parent.path.concat(name);

            parent.addChild(this);
        }
    }

    addChild(suite) {
        this.childs.push(suite);
    }

    addState(name) {
        this.states.push(name);
    }

    isRoot() {
        return !this.parent;
    }

    fullName() {
        return this.isRoot()
            ? this.name
            : _.compact([this.parent.fullName(), this.name]).join('/');
    }
}

module.exports = Suite;
