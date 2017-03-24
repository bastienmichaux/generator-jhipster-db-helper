'use strict';
var path = require('path');
var fse = require('fs-extra');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var deps = [
  [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator db-helper', function () {
  describe('simple test', function () {
    before(function (done) {
      helpers
        .run(path.join( __dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fse.copySync(path.join(__dirname, '../test/templates/default'), dir)
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

    it('generate dummy.txt file', function () {
      assert.file([
        'dummy.txt'
      ]);
    });
  });
});
