/* global describe, beforeEach, it*/

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const DBH_CONSTANTS = require('../generators/dbh-constants');
const DBH_TEST_CONSTANTS = require('../generators/dbh-test-constants');

const Generator = require('../generators/app/index.js');
const GeneratorBase = require('../node_modules/generator-jhipster/generators/generator-base.js');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

// replace 'this.log' for testing purposes
GeneratorBase.prototype.log = msg => console.log(msg);

describe('Post app hook', function () {
    describe('_getPolyfill', function () {
        beforeEach(function () {
            return helpers.run(path.join(__dirname + '/../generators/app/index.js'))
            .inTmpDir(function (dir) {
                return fse.copySync(path.join(__dirname + '/templates/default/usingMaven'), dir);
            })
            .withGenerators(deps)
            .then(onFulfilled => (onFulfilled), onRejected => console.error(onRejected));
        });
        // @todo : have a template config file for testing, file must have : Angular app name, clientFramework, packageManager, etc.
        it('gives the expected polyfill');
    });
    describe('_replaceNamingStrategies (using Gradle)', function () {
        it('replaces the naming strategies');
    });
    describe('_replaceNamingStrategies (using Maven)', function () {
        it('replaces the naming strategies');
    });
});
