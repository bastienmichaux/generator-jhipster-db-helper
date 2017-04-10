/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const yeomanAssert = require('yeoman-assert');
const yeomanTest = require('yeoman-test');

// @todo : find a smarter alternative to this goddamn ugly path
const dbhConstants = require('../generators/dbh-constants');

const deps = [
    [yeomanTest.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator db-helper', function () {
    describe('post entity hook', function () {
        beforeEach(function (done) {
            yeomanTest
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    message: 'simple message to say hello'
                })
                .withGenerators(deps)
                .on('end', done);
        });
        it('finds the spring naming strategies before the post app hook');
        it('finds the spring naming strategies correctly replaced after the post hook');

        it('_replaceNamingStrategies(): removes the Gradle files when the app uses Gradle');
        it('_replaceNamingStrategies(): removes the Maven files when the app uses Gradle');
        it('_replaceNamingStrategies(): throws an error when the app uses an invalid buildTool name');

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
