const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbh = require('../generators/dbh.js');

describe('Dbh', function () {
    it('is a true string', function () {
        assert(dbh.isTrueString('x'));
        assert(!dbh.isTrueString(''));
        assert(!dbh.isTrueString(null));
        assert(!dbh.isTrueString(undefined));
    });

    // pending tests for getApplicationConfig
    it('getApplicationConfig: works as expected provided a correct .yo-rc.json file');
    it('getApplicationConfig: throws an error when file is not found');
});
