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
    describe('module', function () {
        it('works');
    });
});
