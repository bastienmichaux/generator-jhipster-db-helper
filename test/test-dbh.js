const path = require('path');
const fse = require('fs-extra');
const yeomanAssert = require('yeoman-assert');
const yeomanTest = require('yeoman-test');

const dbh = require('../generators/dbh.js');

describe('Dbh', function () {
    it('is a true string', function () {
        yeomanAssert(dbh.isTrueString('x'));
        yeomanAssert(!dbh.isTrueString(''));
        yeomanAssert(!dbh.isTrueString(null));
        yeomanAssert(!dbh.isTrueString(undefined));
    });

    // pending tests for getApplicationConfig
    it('getApplicationConfig: works as expected provided a correct .yo-rc.json file');
    it('getApplicationConfig: throws an error when file is not found');
});
