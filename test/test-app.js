/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator db-helper', () => {
    describe('simple test', () => {
        beforeEach((done) => {
            helpers
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
        /*
        it('generate dummy.txt file', () => {
            assert.file([
                'dummy.txt'
            ]);
        });

        it('find no occurrences of org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy', () => {
            //
        });
        it('find no occurrences of org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy', () => {
            //
        });
        */
    });
});
