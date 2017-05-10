/* global describe, beforeEach, it*/

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbhConstants = require('../generators/dbh-constants');
const Generator = require('../generators/app/index.js');
const jhim = require('../node_modules/generator-jhipster/generators/modules/index.js');
const jhib = require('../node_modules/generator-jhipster/generators/generator-base.js');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

const f = path.join(__dirname, 'templates/default/testReplaceContent.txt');
jhib.prototype.log = (msg) => {
    console.log(msg);
};

describe('Post app hook', function () {
   describe('dummy test', function () {
       it('says foo', function () {
           assert.textEqual(Generator.prototype._sayFoo(), 'foo');
       });
   });
   describe('polyfill', function () {
       it('works as expected', function () {
           console.log(Generator.prototype._polyfillInfo());
       });
   });
   /*
    describe('using Maven', () => {
        it('replaces the naming strategies'
            // gradle file shouldn't be found
            // no reference to the ancient naming strategies, find new strategies instead
        );
    });
    describe('using Gradle', () => {
        it('replaces the naming strategies'
            // maven file shouldn't be found
            // no reference to the ancient naming strategies, find new strategies instead
        );
    });
    */
});
