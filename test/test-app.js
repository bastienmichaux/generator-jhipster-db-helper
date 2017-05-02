/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

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

        it('finds the spring naming strategies before the post app hook');

        it('finds the spring naming strategies replaced after the post hook');
    });
});

describe('JHipster-db-helper post app module', () => {
    describe('using Maven', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/app/index.js'))
            .inTmpDir((dir) => {
                fse.copySync(path.join(__dirname, '../test/templates/app'), dir);
            })/*
            .withArguments([]) // dunnno lol
            .withPrompts({
                // x : y // dunno too ;_;
            })*/
            .on('end', done);
        });

        it('replace the naming strategies when the app uses Maven)', () => {
            //assert.noFile(); // gradle file shouldnt be found
            //assert.content(); // no reference to the ancient naming strategies, find new strategies instead
        });
    });

    describe('using Gradle', () => {
        beforeEach((done) => {
            helpers.run(require.resolve('../generators/app')) // will probably fail
            .inTmpDir((dir) => {
                fse.copySync(path.join(__dirname, '../test/templates/app'), dir); // which folder ?
            })/*
            .withArguments([]) // dunnno lol
            .withPrompts({
                // x : y // dunno too ;_;
            })*/
            .on('end', done);
        });

        it('replace the naming strategies when the app uses Gradle', () => {
            //assert.noFile(); // maven file shouldnt be found
            //assert.content(); // no reference to the ancient naming strategies, find new strategies instead
        });
    });
});
