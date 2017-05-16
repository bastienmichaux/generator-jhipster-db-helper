/**
 * test-fix-entity.js compares the result of JHipster entities with jhipster-db-helper entities
 *
 * test/templates/entities : base entities
 * test/templates/expectedEntities : expected json files after search & replace
 **/
const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbh = require('../generators/dbh.js');
const Generator = require('../generators/fix-entity/index.js');

const deps = [];

describe('Post entity hook', function () {
    describe('_getPolyfill', function () {
        it('returns a valid polyfill', function () {
            const f = path.join(__dirname, 'templates/default/usingMaven/.yo-rc.json');
            assert.file(f);

            return Generator.prototype._getPolyfill(f)
            .catch(err => console.log(err))
            .then(
                onFulfilled => {
                    assert(typeof onFulfilled.jhipsterConfig === 'object');
                    assert(dbh.isNotEmptyString(onFulfilled.javaDir));
                    assert(dbh.isNotEmptyString(onFulfilled.resourceDir));
                    assert(typeof onFulfilled.replaceContent === 'function');
                    assert(typeof onFulfilled.updateEntityConfig === 'function');
                },
                onRejected => {
                    return onRejected;
                }
            );
        });
    });
});
