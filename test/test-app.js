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

describe('JHipster-db-helper post app module', () => {
    describe('using Maven', () => {
        it('replaces the naming strategies', () => {
            // gradle file shouldn't be found
            // no reference to the ancient naming strategies, find new strategies instead
        });
    });


    describe('using Gradle', () => {
        it('replaces the naming strategies', () => {
            // maven file shouldn't be found
            // no reference to the ancient naming strategies, find new strategies instead
        });
    });
});
