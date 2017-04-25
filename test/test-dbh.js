const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const _ = require('lodash');

const dbh = require('../generators/dbh.js');
const DBH_CONSTANTS = require('../generators/dbh-constants');

const expectedAppConfig = {
    'generator-jhipster': {
        baseName: 'sampleMysql',
        packageName: 'com.mycompany.myapp',
        packageFolder: 'com/mycompany/myapp',
        authenticationType: 'session',
        hibernateCache: 'ehcache',
        clusteredHttpSession: 'no',
        websocket: 'no',
        databaseType: 'sql',
        devDatabaseType: 'h2Disk',
        prodDatabaseType: 'mysql',
        searchEngine: 'no',
        useSass: false,
        buildTool: 'maven',
        frontendBuilder: 'grunt',
        enableTranslation: true,
        enableSocialSignIn: false,
        rememberMeKey: '2bb60a80889aa6e6767e9ccd8714982681152aa5',
        testFrameworks: [
            'gatling'
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
        it('excludes the Gradle file(s) when given \'maven\' as parameter', function () {
            // compare sorted arrays (index is irrelevant)
            const files = dbh.getFilesWithNamingStrategy('maven').sort();
            const expectedArray = [
                './pom.xml',
                './src/main/resources/config/application.yml',
                './src/test/resources/config/application.yml'
            ].sort();
            assert(_.isEqual(files, expectedArray));
        });
        it('excludes the Maven file(s) when given \'gradle\' as parameter', function () {
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
                let foo = dbh.getFilesWithNamingStrategy('foo'); l;
            }, Error);
        });
    });
    describe('getPluralColumnIdName', function () {
        it('');
    });
    describe('hasConstraints', function () {
        const relationshipsSamples = {
            oneToOneOwner: [
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'region',
                    otherEntityName: 'region',
                    otherEntityField: 'id',
                    ownerSide: true,
                    otherEntityRelationshipName: 'country'
                }
            ],
            mixedWithOneConstraint: [
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'location',
                    otherEntityName: 'location',
                    otherEntityField: 'id',
                    ownerSide: true,
                    otherEntityRelationshipName: 'department'
                },
                {
                    relationshipType: 'one-to-many',
                    javadoc: 'A relationship',
                    relationshipName: 'employee',
                    otherEntityName: 'employee',
                    otherEntityRelationshipName: 'department'
                }
            ],
            mixedWithTwoConstraints: [
                {
                    relationshipName: 'department',
                    otherEntityName: 'department',
                    relationshipType: 'many-to-one',
                    otherEntityField: 'id'
                },
                {
                    relationshipType: 'one-to-many',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    otherEntityRelationshipName: 'employee'
                },
                {
                    relationshipType: 'many-to-one',
                    relationshipName: 'manager',
                    otherEntityName: 'employee',
                    otherEntityField: 'id'
                }
            ],
            tripleOneToOneOwner: [
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    otherEntityField: 'id',
                    ownerSide: true,
                    otherEntityRelationshipName: 'jobHistory'
                },
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'department',
                    otherEntityName: 'department',
                    otherEntityField: 'id',
                    ownerSide: true,
                    otherEntityRelationshipName: 'jobHistory'
                },
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'employee',
                    otherEntityName: 'employee',
                    otherEntityField: 'id',
                    ownerSide: true,
                    otherEntityRelationshipName: 'jobHistory'
                }
            ],
            mixedConstraints: [
                {
                    relationshipName: 'employee',
                    otherEntityName: 'employee',
                    relationshipType: 'many-to-one',
                    otherEntityField: 'id'
                },
                {
                    relationshipType: 'many-to-many',
                    otherEntityRelationshipName: 'job',
                    relationshipName: 'task',
                    otherEntityName: 'task',
                    otherEntityField: 'title',
                    ownerSide: true
                }
            ],
            Empty: [],
            manyToManyNotOwner: [
                {
                    relationshipType: 'many-to-many',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    ownerSide: false,
                    otherEntityRelationshipName: 'task'
                }
            ],
            oneToOneNotOwner: [
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    ownerSide: false,
                    otherEntityRelationshipName: 'task'
                }
            ],
            mixedNotOwner: [
                {
                    relationshipType: 'one-to-one',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    ownerSide: false,
                    otherEntityRelationshipName: 'task'
                },
                {
                    relationshipType: 'many-to-many',
                    relationshipName: 'job',
                    otherEntityName: 'job',
                    ownerSide: false,
                    otherEntityRelationshipName: 'task'
                }
            ]
        };

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
    });
    describe('isTrueString', function () {
        it('works with true strings', function () {
            assert(dbh.isTrueString('x') === true);
            assert(dbh.isTrueString(' ') === true);
            assert(dbh.isTrueString('\r') === true);
        });
        it('fails with wrong input', function () {
            assert(dbh.isTrueString('') === false);
            assert(dbh.isTrueString({foo: 'bar'}) === false);
            assert(dbh.isTrueString(['foo']) === false);
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
