const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const _ = require('lodash');

const dbh = require('../generators/dbh.js');
const DBH_CONSTANTS = require('../generators/dbh-constants');

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
        it('works as expected with treacherous input', function () {
            assert(dbh.getColumnIdName('Authors') === 'authors_id');
            assert(dbh.getColumnIdName('AUTHORS') === 'authors_id');
            assert(dbh.getColumnIdName('IT_IS_OVER_9000') === 'it_is_over_9000_id');
            assert(dbh.getColumnIdName('AuthorTable') === 'author_table_id');
            assert(dbh.getColumnIdName('TheAuthor_table') === 'the_author_table_id');
            assert(dbh.getColumnIdName('XMLHTTPPosts') === 'xmlhttpposts_id');
            assert(dbh.getColumnIdName('CssClassesService') === 'css_classes_service_id');
            assert(dbh.getColumnIdName('CSSClassesService') === 'cssclasses_service_id');
        });
    });
    describe('getFilesWithNamingStrategy', function () {
        it(`excludes the Gradle file(s) when given 'maven' as parameter`, function () {
            // compare sorted arrays (index is irrelevant)
            const files = dbh.getFilesWithNamingStrategy('maven').sort();
            const expectedArray = [
                './pom.xml',
                './src/main/resources/config/application.yml',
                './src/test/resources/config/application.yml'
            ].sort();
            assert(_.isEqual(files, expectedArray));
        });
        it(`excludes the Maven file(s) when given 'gradle' as parameter`, function () {
            // compare sorted arrays (index is irrelevant)
            const files = dbh.getFilesWithNamingStrategy('gradle').sort();
            const expectedArray = [
                './src/main/resources/config/application.yml',
                './src/test/resources/config/application.yml',
                './gradle/liquibase.gradle',
            ].sort();
            assert(_.isEqual(files, expectedArray));
        });
        it(`throws when given an unknown build tool`, function () {
            assert.throws(() => {
                let foo = dbh.getFilesWithNamingStrategy('foo');
            }, Error);
        });
    });
    describe('getPluralColumnIdName', function () {
        it('tests THINGS', function () {
            assert(dbh.getPluralColumnIdName('author') === 'authors_id');
            assert(dbh.getPluralColumnIdName('the_Authors_table') === 'the_authors_tables_id');
            assert(dbh.getPluralColumnIdName('01234') === '01234s_id');
            assert(dbh.getPluralColumnIdName('AUTHORSTABLE') === 'authorstables_id');
            assert(dbh.getPluralColumnIdName('AUTHORS_TABLE') === 'authors_tables_id');
            assert(dbh.getPluralColumnIdName('_') === '_s_id');
            assert(dbh.getPluralColumnIdName('') === '_id');
            assert(dbh.getPluralColumnIdName('\rAuthor') === '\rauthors_id');
            assert(dbh.getPluralColumnIdName('\tAuthor') === '\tauthors_id');
            assert(dbh.getPluralColumnIdName('XMLHTTPAPIService') === 'xmlhttpapiservices_id');
            assert(dbh.getPluralColumnIdName('XmlHttpApiService') === 'xml_http_api_services_id');
        });
    });
    describe('hasConstraints', function () {
        it('');
    });
    describe('isNotEmptyString', function () {
        it('works with true strings', function () {
            assert(dbh.isNotEmptyString('x') === true);
            assert(dbh.isNotEmptyString(' ') === true);
            assert(dbh.isNotEmptyString('\r') === true);
        });
        it('fails with wrong input', function () {
            assert(dbh.isNotEmptyString('') === false);
            assert(dbh.isNotEmptyString(() => 'foo') === false);
        });
    });
    describe('validateColumnName', function () {
        // messages output by validateColumnName
        // TODO: 0% maintainability, find something smarter
        const failMsgWhenSpecialChar = 'Your column name cannot contain special characters';
        const failMsgWhenEmpty = 'Your column name cannot be empty';
        const failMsgWhenTooLongForOracle = 'Your column name is too long for Oracle, try a shorter name';

        it('works as expected', function () {
            assert(dbh.validateColumnName('Book', 'mysql') === true);
            assert(dbh.validateColumnName('FOO', 'mysql') === true);
            assert(dbh.validateColumnName('bar', 'mysql') === true);
            assert(dbh.validateColumnName('_foo2', 'mysql') === true);
            assert(dbh.validateColumnName('2Foo2Bar', 'mysql') === true);
            assert(dbh.validateColumnName('06', 'mysql') === true);
            assert(dbh.validateColumnName('_', 'mysql') === true);
            assert(dbh.validateColumnName('quiteLongTableName', 'mysql') === true);
            assert(dbh.validateColumnName('definitelyVeryLongTableName', 'mysql') === true);
        });
        it(`returns '${failMsgWhenSpecialChar}'`, function () {
            assert(dbh.validateColumnName(' ', 'mysql') === failMsgWhenSpecialChar);
            assert(dbh.validateColumnName('\r', 'mysql') === failMsgWhenSpecialChar);
            assert(dbh.validateColumnName('\t', 'mysql') === failMsgWhenSpecialChar);
            assert(dbh.validateColumnName('Böök', 'mysql') === failMsgWhenSpecialChar);
            assert(dbh.validateColumnName('book-table', 'mysql') === failMsgWhenSpecialChar);
        });
        it(`returns '${failMsgWhenEmpty}'`, function () {
            assert(dbh.validateColumnName('', 'mysql') === failMsgWhenEmpty);
        });
        it(`returns '${failMsgWhenTooLongForOracle}'`, function () {
            assert(dbh.validateColumnName('definitelyVeryLongTableName', 'oracle') === failMsgWhenTooLongForOracle);
        });
    });
    describe('validateTableName', function () {
        // messages output by validateTableName
        // TODO: 0% maintainability, find something smarter
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
    });
    /*
    describe('', function () {
        it('', function () {
        });
    });
    */
});
