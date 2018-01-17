/* global describe, beforeEach, it */
/* eslint-disable prefer-arrow-callback */

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const DBH_CONSTANTS = require('../generators/dbh-constants');

const Generator = require('../generators/app/index.js');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

const postAppGenerator = path.join(__dirname, '../generators/app/index.js');

describe('Post app hook', function () {
    describe('_getConfigFilePath', function () {
        it('return the expected file (gradle)', function () {
            const expectedFile = path.join(__dirname, 'templates/default/usingGradle/.yo-rc.json');
            const testedPath = Generator.prototype._getConfigFilePath(DBH_CONSTANTS.testCases.usingGradle);
            assert.file(expectedFile);
            assert.textEqual(expectedFile, testedPath);
        });
        it('return the expected file (maven)', function () {
            const expectedFile = path.join(__dirname, 'templates/default/usingMaven/.yo-rc.json');
            const testedPath = Generator.prototype._getConfigFilePath(DBH_CONSTANTS.testCases.usingMaven);
            assert.file(expectedFile);
            assert.textEqual(expectedFile, testedPath);
        });
    });
    // TODO : reduce code duplication when assigning 'testedFiles'
    describe('_replaceNamingStrategies, with an application using Maven', function () {
        it('works', function () {
            assert.file(postAppGenerator);

            // folder where we copy the files
            const folder = path.join(__dirname, 'templates/default/usingMaven');
            const temporaryFolder = path.join(__dirname, 'testDir/usingMaven');

            // files copied in temporaryFolder
            const files = fs.readdirSync(folder);

            // grab from the copied files only those who have the naming strategies
            const testedFiles = [
                path.join(temporaryFolder, 'pom.xml'),
                path.join(temporaryFolder, 'src/main/resources/config/application.yml'),
                path.join(temporaryFolder, 'src/test/resources/config/application.yml')
            ];

            // absolute paths we'll need
            const filesAbsolutePath = [];

            // set absolute paths for the files
            // assert that the files to be copied exist, then get their path
            files.forEach((file, index, array) => {
                filesAbsolutePath.push(path.join(folder, file));
                assert.file(filesAbsolutePath[index]);
            });

            /**
             * run the post-app generator (generators/app/index.js)
             * the options passed allow us to test outside of an application
             * the deps object is needed because this generator needs jhipster:modules
             * in the temporary folder, we copy the files and assert they have the old naming strategies
             * (as it would happen in an application where jhipster-db-helper hasn't been run yet)
             * then we check the naming strategies have been replaced
             */
            return helpers.run(postAppGenerator)
                .withOptions({ dbhTestCase: DBH_CONSTANTS.testCases.usingMaven }) // this option allow testing outside of an application
                .withGenerators(deps) // generator(s) we compose with
                .inDir(temporaryFolder, function () {
                // copy the files that the generator will modify
                    fse.copySync(folder, temporaryFolder);

                    // assert that the old naming strategies are still there
                    testedFiles.forEach((currentFile) => {
                        assert.file(currentFile);
                        assert.fileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyOld);
                        assert.fileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyOld);
                        assert.noFileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyNew);
                        assert.noFileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyNew);
                    });
                })
                .then(
                    (tmpFolder) => {
                    // assert the tested files have the new naming strategies
                        testedFiles.forEach((currentFile) => {
                            assert.file(currentFile);
                            assert.noFileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyOld);
                            assert.noFileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyOld);
                            assert.fileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyNew);
                            assert.fileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyNew);
                        });
                    },
                    (onError) => {
                        console.error(onError);
                    }
                )
                .then(
                    (tmpFolder) => {
                    // empty the test folder for the next test session
                        fse.emptyDirSync(temporaryFolder);
                    },
                    (onError) => {
                    // in case of error, empty the test folder anyway
                        fse.emptyDirSync(temporaryFolder);
                        console.error(onError);
                    }
                );
        });
    });
    describe('_replaceNamingStrategies, with an application using Gradle', function () {
        // cf. unit test above
        it('works', function () {
            // folder where we copy the files
            const folder = path.join(__dirname, 'templates/default/usingGradle');
            const temporaryFolder = path.join(__dirname, 'testDir/usingGradle');

            // files copied in temporaryFolder
            const files = fs.readdirSync(folder);

            // grab from the copied files only those who have the naming strategies
            const testedFiles = [
                path.join(temporaryFolder, 'gradle/liquibase.gradle'),
                path.join(temporaryFolder, 'src/main/resources/config/application.yml'),
                path.join(temporaryFolder, 'src/test/resources/config/application.yml')
            ];

            // absolute paths we'll need
            const filesAbsolutePath = [];

            // set absolute paths for the files
            // assert that the files to be copied exist, then get their path
            files.forEach((file, index, array) => {
                filesAbsolutePath.push(path.join(folder, file));
                assert.file(filesAbsolutePath[index]);
            });

            return helpers.run(postAppGenerator)
                .withOptions({ dbhTestCase: DBH_CONSTANTS.testCases.usingGradle }) // this option allow testing outside of an application
                .withGenerators(deps) // generator(s) we compose with
                .inDir(temporaryFolder, function () {
                // copy the files that the generator will modify
                    fse.copySync(folder, temporaryFolder);

                    // assert that the old naming strategies are still there
                    testedFiles.forEach((currentFile) => {
                        assert.file(currentFile);
                        assert.fileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyOld);
                        assert.fileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyOld);
                        assert.noFileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyNew);
                        assert.noFileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyNew);
                    });
                })
                .then(
                    (tmpFolder) => {
                    // assert the tested files have the new naming strategies
                        testedFiles.forEach((currentFile) => {
                            assert.file(currentFile);
                            assert.noFileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyOld);
                            assert.noFileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyOld);
                            assert.fileContent(currentFile, DBH_CONSTANTS.implicitNamingStrategyNew);
                            assert.fileContent(currentFile, DBH_CONSTANTS.physicalNamingStrategyNew);
                        });
                    },
                    (onError) => {
                        console.error(onError);
                    }
                )
                .then(
                    (tmpFolder) => {
                    // empty the test folder for the next test session
                        fse.emptyDirSync(temporaryFolder);
                    },
                    (onError) => {
                    // in case of error, empty the test folder anyway
                        fse.emptyDirSync(temporaryFolder);
                        console.error(onError);
                    }
                );
        });
    });
});
