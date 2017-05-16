/* global describe, beforeEach, it*/

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbh = require('../generators/dbh.js');
const DBH_CONSTANTS = require('../generators/dbh-constants');
const DBH_TEST_CONSTANTS = require('../generators/dbh-test-constants');

const Generator = require('../generators/app/index.js');
const GeneratorBase = require('../node_modules/generator-jhipster/generators/generator-base.js');
const jhipsterModuleSubgenerator = require('../node_modules/generator-jhipster/generators/modules/index.js');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

// replace 'this.log' for testing purposes
// GeneratorBase.prototype.log = msg => console.log(msg);

describe('Post app hook', function () {
    describe('_getPolyfill', function () {
        it('returns a valid polyfill', function () {
            const f = path.join(__dirname, 'templates/default/usingMaven/.yo-rc.json');
            assert.file(f);

            return Generator.prototype._getPolyfill(f)
            .then(
                onFulfilled => {
                    assert(dbh.isNotEmptyString(onFulfilled.baseName));
                    assert(dbh.isNotEmptyString(onFulfilled.packageName));
                    assert(dbh.isNotEmptyString(onFulfilled.angularAppName) || onFulfilled.angularAppName === null);
                    assert(dbh.isNotEmptyString(onFulfilled.clientFramework));
                    assert(dbh.isNotEmptyString(onFulfilled.clientPackageManager));
                    assert(dbh.isNotEmptyString(onFulfilled.buildTool) && dbh.isValidBuildTool(onFulfilled.buildTool));
                    assert(typeof onFulfilled.replaceContent === 'function');
                    assert(typeof onFulfilled.registerModule === 'function');
                    assert(typeof onFulfilled.updateEntityConfig === 'function');
                },
                onRejected => {
                    return onRejected;
                }
            );
        });
    });
    describe('_replaceNamingStrategies', function () {
        it('works as expected');
    });
});
