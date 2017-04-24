const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbh = require('../generators/dbh.js');

const expectedAppConfig = {
    "generator-jhipster": {
        "baseName": "sampleMysql",
        "packageName": "com.mycompany.myapp",
        "packageFolder": "com/mycompany/myapp",
        "authenticationType": "session",
        "hibernateCache": "ehcache",
        "clusteredHttpSession": "no",
        "websocket": "no",
        "databaseType": "sql",
        "devDatabaseType": "h2Disk",
        "prodDatabaseType": "mysql",
        "searchEngine": "no",
        "useSass": false,
        "buildTool": "maven",
        "frontendBuilder": "grunt",
        "enableTranslation": true,
        "enableSocialSignIn": false,
        "rememberMeKey": "2bb60a80889aa6e6767e9ccd8714982681152aa5",
        "testFrameworks": [
            "gatling"
        ]
    }
};

// Dbh unit test
describe('Dbh', function () {
    describe('getColumnIdName', function () {
        it('works as expected with treacherous inputs', function () {
            assert(dbh.getColumnIdName('Authors') === 'authors_id');
            assert(dbh.getColumnIdName('AUTHORS') === 'authors_id');
            assert(dbh.getColumnIdName('IT_IS_OVER_9000') === 'it_is_over_9000_id');
            assert(dbh.getColumnIdName('AuthorTable') === 'author_table_id');
            assert(dbh.getColumnIdName('TheAuthor_table' === 'the_author_table_id'));
            assert(dbh.getColumnIdName('XMLHTTPPosts') === 'xmlhttpposts_id');
            assert(dbh.getColumnIdName('CssService' === 'css_service_id'));
            assert(dbh.getColumnIdName('CSSService' === 'cssservice_id'));
        });
    });
    describe('getFilesWithNamingStrategy', function () {
        it('');
    });
    describe('getPluralColumnIdName', function () {
        it('');
    });
    describe('hasConstraints', function () {
        it('');
    });
    describe('isTrueString', function () {
        it('');
    });
    describe('validateColumnName', function () {
        it('');
    });
    describe('validateTableName', function () {
        const failMsgWhenSpecialChar = 'The table name cannot contain special characters';
        const failMsgWhenEmpty = 'The table name cannot be empty';
        const failMsgWhenTooLongForOracle = 'The table name is too long for Oracle, try a shorter name';
        const failMsgWhenLongForOracle = 'The table name is long for Oracle, long table names can cause issues when used to create constraint names and join table names';
        it('works as expected', function () {
            assert(dbh.validateTableName('Book', 'mysql') === true);
            assert(dbh.validateTableName('FOO', 'mysql') === true);
            assert(dbh.validateTableName('bar', 'mysql') === true);
            assert(dbh.validateTableName('_foo2', 'mysql') === true);
            assert(dbh.validateTableName('2Foo2Bar', 'mysql') === true);
            assert(dbh.validateTableName('06', 'mysql') === true);
            assert(dbh.validateTableName('_', 'mysql') === true);
            assert(dbh.validateTableName('quiteLongTableName', 'mysql') === true);
            assert(dbh.validateTableName('definitelyVeryLongTableName', 'mysql') === true);
        });
        it('fails with missing parameter', function () {
            assert.throws(() => dbh.validateTableName('Book'), Error);
        });
        it(`returns '${failMsgWhenSpecialChar}'`, function () {
            assert(dbh.validateTableName('Böök', 'mysql') === failMsgWhenSpecialChar);
            assert(dbh.validateTableName('book-table', 'mysql') === failMsgWhenSpecialChar);
        });
        it(`returns '${failMsgWhenEmpty}'`, function () {
            assert(dbh.validateTableName('', 'mysql') === failMsgWhenEmpty);
        });
        it(`returns '${failMsgWhenTooLongForOracle}'`, function () {
            assert(dbh.validateTableName('definitelyVeryLongTableName', 'oracle') === failMsgWhenTooLongForOracle);
        });
        it(`returns '${failMsgWhenLongForOracle}'`, function () {
            assert(dbh.validateTableName('quiteLongTableName', 'oracle') === failMsgWhenLongForOracle);
        });
        /*
        it(`returns 'This is a table name`, function () {

        });
        */
    });
    /*
    describe('', function () {
        it('');
    });
    */
});
