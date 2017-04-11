/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbhApp = require('../generators/app/index.js');

// @todo : find a smarter alternative to this goddamn ugly path
const dbhConstants = require('../generators/dbh-constants');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator db-helper', function () {
    describe('post entity hook', function () {
        beforeEach(function (done) {
            helpers
            .run(path.join(__dirname, '../generators/app/index.js'))
            .inTmpDir((dir) => {
                fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
            })
            .withOptions({
                testmode: true,
                skipInstall: true
            })
            .withGenerators(deps)
            .on('end', done);
        });

        // test the naming strategies replacement

        it('finds the spring naming strategies before the post app hook', function () {

        });

        it('finds the spring naming strategies replaced after the post hook', function () {

        });

        // test retrieval of the app build tool (Maven or Gradle)

        it('_replaceNamingStrategies(): removes the Gradle files when the app uses Gradle', function () {

        });

        it('_replaceNamingStrategies(): removes the Maven files when the app uses Gradle', function () {

        });

        it('_replaceNamingStrategies(): throws an error when the app uses an invalid buildTool name', function () {

        });

        /*
        it('find no occurrences of org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy', () => {
            assert.fileContent(file, /org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy/);
        });
        it('find no occurrences of org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy', () => {
            assert.fileContent(file, /org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy/);
        });
        */
    });
});
