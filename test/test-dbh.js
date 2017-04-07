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
});
