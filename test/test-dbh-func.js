/* global describe, beforeEach, it*/

const dbhFunc = require('../generators/dbh-func.js');
const DBH_TEST_CONSTANTS = require('../generators/dbh-test-constants.js');
const path = require('path');
const assert = require('yeoman-assert');

describe('dbh-func', function () {
    const usingGradleFolder = path.join(__dirname, './templates/default/usingGradle/');
    const usingMavenFolder = path.join(__dirname, './templates/default/usingMaven/');

    describe('getAppConfig', function () {
        it('returns a correct json file for a project using Gradle', function () {
            const expectedConfigFile = DBH_TEST_CONSTANTS.templateConfigFile.usingGradle;
            return dbhFunc.getAppConfig(usingGradleFolder)
            .then(onResolve => {
                assert.deepStrictEqual(onResolve, expectedConfigFile);
            });
        });
        it('returns a correct json file for a project using Maven', function () {
            const expectedConfigFile = DBH_TEST_CONSTANTS.templateConfigFile.usingMaven;
            return dbhFunc.getAppConfig(usingMavenFolder)
            .then(onResolve => {
                assert.deepStrictEqual(onResolve, expectedConfigFile);
            });
        });
    });
    describe('getAppBuildTool', function () {
        it('returns the expected build tool for a project using Gradle', function () {
            const expectedValue = 'gradle';
            return dbhFunc.getAppConfigBuildTool(usingGradleFolder)
            .then(onResolve => {
                assert.textEqual(onResolve, expectedValue);
            });
        });
        it('returns the expected build tool for a project using Maven', function () {
           const expectedValue = 'maven';
           return dbhFunc.getAppConfigBuildTool(usingMavenFolder)
           .then(onResolve => {
               assert.textEqual(onResolve, expectedValue);
           });
       });
    });
});
