/* global describe, beforeEach, it*/
/* eslint-disable prefer-arrow-callback */

const _ = require('lodash');
const assert = require('yeoman-assert');
const path = require('path');

const dbh = require('../generators/dbh.js');
const DBH_TEST_CONSTANTS = require('./test-constants.js');


// Dbh unit test
describe('Dbh', function () {
    describe('getAppConfig', function () {
        it('returns the expected app config with Maven as build tool', function () {
            const expectedConfig = DBH_TEST_CONSTANTS.templateConfigFile.usingMaven;
            const f = path.join(__dirname, 'templates/default/usingMaven/.yo-rc.json');

            assert.file(f);

            return dbh.getAppConfig(f)
            .catch(err => console.error(err))
            .then(onFulfilled => {
                assert(typeof onFulfilled === 'object');
                assert.deepStrictEqual(expectedConfig, onFulfilled);
            }, onRejected => {
                console.log(onRejected);
            });
        });
        it('returns the expected app config with Gradle as build tool', function () {
            const expectedConfig = DBH_TEST_CONSTANTS.templateConfigFile.usingGradle;
            const f = path.join(__dirname, 'templates/default/usingGradle/.yo-rc.json');

            assert.file(f);

            return dbh.getAppConfig(f)
            .catch(err => console.error(err))
            .then((onFulfilled) => {
                assert(typeof onFulfilled === 'object');
                assert.deepStrictEqual(expectedConfig, onFulfilled);
            }, (onRejected) => {
                console.log(onRejected);
            });
        });
        it('throws when a file is not found', function () {
            return dbh.getAppConfig('foo.bar')
            .then((onFulfilled) => {
                throw new Error('Promise should have been rejected but was instead fulfilled');
            }, (onRejected) => {
                assert(onRejected instanceof Error);
            });
        });
        it('throws when the output file is no correct json', function () {
            return dbh.getAppConfig('./templates/default/usingMaven/pom.xml')
            .then(
                (onFulfilled) => {
                    throw new Error('Promise should have been rejected but was instead fulfilled');
                },
                (onRejected) => {
                    assert(onRejected instanceof Error);
                }
            );
        });
    });
    describe('getColumnIdName', function () {
        it('works as expected with treacherous input', function () {
            assert.textEqual(dbh.getColumnIdName('Authors'), 'authors_id');
            assert.textEqual(dbh.getColumnIdName('AUTHORS'), 'authors_id');
            assert.textEqual(dbh.getColumnIdName('IT_IS_OVER_9000'), 'it_is_over_9000_id');
            assert.textEqual(dbh.getColumnIdName('AuthorTable'), 'author_table_id');
            assert.textEqual(dbh.getColumnIdName('TheAuthor_table'), 'the_author_table_id');
            assert.textEqual(dbh.getColumnIdName('XMLHTTPPosts'), 'xmlhttpposts_id');
            assert.textEqual(dbh.getColumnIdName('CssClassesService'), 'css_classes_service_id');
            assert.textEqual(dbh.getColumnIdName('CSSClassesService'), 'cssclasses_service_id');
        });
    });
    describe('getFilesWithNamingStrategy', function () {
        it('excludes the Gradle file(s) when given "maven" as parameter', function () {
            // compare sorted arrays (index is irrelevant)
            const files = dbh.getFilesWithNamingStrategy('maven').sort();
            const expectedArray = [
                './pom.xml',
                './src/main/resources/config/application.yml',
                './src/test/resources/config/application.yml'
            ].sort();
            assert(_.isEqual(files, expectedArray));
        });
        it('excludes the Maven file(s) when given "gradle" as parameter', function () {
            // compare sorted arrays (index is irrelevant)
            const files = dbh.getFilesWithNamingStrategy('gradle').sort();
            const expectedArray = [
                './src/main/resources/config/application.yml',
                './src/test/resources/config/application.yml',
                './gradle/liquibase.gradle',
            ].sort();
            assert(_.isEqual(files, expectedArray));
        });
        it('throws when given an unknown build tool', function () {
            assert.throws(() => {
                let foo = dbh.getFilesWithNamingStrategy('foo'); // eslint-disable-line no-unused-vars, prefer-const
            }, Error);
        });
    });
    describe('getPluralColumnIdName', function () {
        it('works as expected', function () {
            // because of validation rules,
            // some of these assertions would never appear in a real application
            // however contrived column names are a useful reference for further development
            assert.textEqual(dbh.getPluralColumnIdName('author'), 'authors_id');
            assert.textEqual(dbh.getPluralColumnIdName('the_Authors_table'), 'the_authors_tables_id');
            assert.textEqual(dbh.getPluralColumnIdName('01234'), '01234s_id');
            assert.textEqual(dbh.getPluralColumnIdName('AUTHORSTABLE'), 'authorstables_id');
            assert.textEqual(dbh.getPluralColumnIdName('AUTHORS_TABLE'), 'authors_tables_id');
            assert.textEqual(dbh.getPluralColumnIdName('_'), '_s_id');
            assert.textEqual(dbh.getPluralColumnIdName(''), '_id');
            assert.textEqual(dbh.getPluralColumnIdName('\r'), '\rs_id');
            assert.textEqual(dbh.getPluralColumnIdName('\rAuthor'), '\rauthors_id');
            assert.textEqual(dbh.getPluralColumnIdName('XMLHTTPAPIService'), 'xmlhttpapiservices_id');
            assert.textEqual(dbh.getPluralColumnIdName('XmlHttpApiService'), 'xml_http_api_services_id');
        });
    });
    describe('hasConstraints', function () {
        const relationshipsSamples = DBH_TEST_CONSTANTS.relationshipsSamples;

        it('returns false with empty relation', function () {
            assert(dbh.hasConstraints(relationshipsSamples.Empty) === false);
        });
        it('returns false if not owner of the relationship', function () {
            assert(dbh.hasConstraints(relationshipsSamples.manyToManyNotOwner) === false);
            assert(dbh.hasConstraints(relationshipsSamples.oneToOneNotOwner) === false);
            assert(dbh.hasConstraints(relationshipsSamples.mixedNotOwner) === false);
        });
        it('returns true if owner of the relationship', function () {
            assert(dbh.hasConstraints(relationshipsSamples.oneToOneOwner) === true);
            assert(dbh.hasConstraints(relationshipsSamples.tripleOneToOneOwner) === true);
        });
        it('returns true if it is owner in at least one relation', function () {
            assert(dbh.hasConstraints(relationshipsSamples.mixedConstraints) === true);
            assert(dbh.hasConstraints(relationshipsSamples.mixedWithOneConstraint) === true);
            assert(dbh.hasConstraints(relationshipsSamples.mixedWithTwoConstraints) === true);
        });
        it('throws when given a wrong type parameter', function () {
            assert.throws(() => dbh.hasConstraints(''), TypeError);
            assert.throws(() => dbh.hasConstraints(0), TypeError);
            assert.throws(() => dbh.hasConstraints(null), TypeError);
            assert.throws(() => dbh.hasConstraints(undefined), TypeError);
            assert.throws(() => dbh.hasConstraints(false), TypeError);
        });
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
    describe('isValidBuildTool', function () {
        it('works as expected', function () {
            assert(dbh.isValidBuildTool('maven') === true);
            assert(dbh.isValidBuildTool('gradle') === true);
            assert(dbh.isValidBuildTool('Maven') === false);
            assert(dbh.isValidBuildTool('Gradle') === false);
            assert(dbh.isValidBuildTool('foo') === false);
            assert(dbh.isValidBuildTool() === false);
        });
    });
    describe('validateColumnName', function () {
        // messages output by validateColumnName
        // TODO: 0% maintainability, find something smarter
        const failMsgWhenSpecialChar = 'Your column name cannot contain special characters';
        const failMsgWhenEmpty = 'Your column name cannot be empty';
        const failMsgWhenTooLongForOracle = 'Your column name is too long for Oracle, try a shorter name';

        it('valid column names return true', function () {
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
            assert.textEqual(dbh.validateColumnName(' ', 'mysql'), failMsgWhenSpecialChar);
            assert.textEqual(dbh.validateColumnName('\r', 'mysql'), failMsgWhenSpecialChar);
            assert.textEqual(dbh.validateColumnName('\t', 'mysql'), failMsgWhenSpecialChar);
            assert.textEqual(dbh.validateColumnName('Böök', 'mysql'), failMsgWhenSpecialChar);
            assert.textEqual(dbh.validateColumnName('book-table', 'mysql'), failMsgWhenSpecialChar);
        });
        it(`returns '${failMsgWhenEmpty}'`, function () {
            assert.textEqual(dbh.validateColumnName('', 'mysql'), failMsgWhenEmpty);
        });
        it(`returns '${failMsgWhenTooLongForOracle}'`, function () {
            assert.textEqual(dbh.validateColumnName('definitelyVeryLongTableName', 'oracle'), failMsgWhenTooLongForOracle);
        });
    });
    describe('validateTableName', function () {
        // messages output by validateTableName
        // TODO: 0% maintainability, find something smarter
        const failMsgWhenSpecialChar = 'The table name cannot contain special characters';
        const failMsgWhenEmpty = 'The table name cannot be empty';
        const failMsgWhenTooLongForOracle = 'The table name is too long for Oracle, try a shorter name';
        const failMsgWhenLongForOracle = 'The table name is long for Oracle, long table names can cause issues when used to create constraint names and join table names';

        it('valid table names return true', function () {
            assert(dbh.validateTableName('Book', 'mysql'));
            assert(dbh.validateTableName('FOO', 'mysql') === true);
            assert(dbh.validateTableName('bar', 'mysql') === true);
            assert(dbh.validateTableName('_foo2', 'mysql') === true);
            assert(dbh.validateTableName('2Foo2Bar', 'mysql') === true);
            assert(dbh.validateTableName('06', 'mysql') === true);
            assert(dbh.validateTableName('_', 'mysql') === true);
            assert(dbh.validateTableName('quiteLongTableName', 'mysql') === true);
            assert(dbh.validateTableName('definitelyVeryLongTableName', 'mysql') === true);
        });
        it('returns the correct error message with a name containing a reserved keyword', function () {
            assert.textEqual(dbh.validateTableName('ASENSITIVE', 'mysql').toString(), '\'ASENSITIVE\' is a mysql reserved keyword.');
        });
        it('fails with missing parameter', function () {
            assert.throws(() => dbh.validateTableName('Book'), Error);
        });
        it(`returns '${failMsgWhenSpecialChar}'`, function () {
            assert.textEqual(dbh.validateTableName('Böök', 'mysql'), failMsgWhenSpecialChar);
            assert.textEqual(dbh.validateTableName('book-table', 'mysql'), failMsgWhenSpecialChar);
        });
        it(`returns '${failMsgWhenEmpty}'`, function () {
            assert.textEqual(dbh.validateTableName('', 'mysql'), failMsgWhenEmpty);
        });
        it(`returns '${failMsgWhenTooLongForOracle}'`, function () {
            assert.textEqual(dbh.validateTableName('definitelyVeryLongTableName', 'oracle'), failMsgWhenTooLongForOracle);
        });
        it(`returns '${failMsgWhenLongForOracle}'`, function () {
            assert.textEqual(dbh.validateTableName('quiteLongTableName', 'oracle'), failMsgWhenLongForOracle);
        });
    });
});
