/** jhipster-db-helper constants */
/* eslint-disable quotes, quote-props, key-spacing */

const jhicore = require('jhipster-core');

const constants = {
    /**
     * Configuration files in generator-jhipster that include the Spring naming strategies (as of JHipster 4.1.1).
     * These files are replaced by our module to avoid inconsistencies when mapping over an existing DB.
     * This constant could be dynamically initialized instead of being static. It isn't future-proof.
     * @constant
     * @todo Add relevant links (StackOverflow) to this doc
     * @type {string[]}
     */
    filesWithNamingStrategy: {
        base: ['./src/main/resources/config/application.yml', './src/test/resources/config/application.yml'],
        gradle: ['./gradle/liquibase.gradle'],
        maven: ['./pom.xml'],
    },

    /**
     * The application file for the current JHipster app.
     * @constant
     * @warn Currently unused
     * @type {string}
     */
    appConfigFile: '.yo-rc.json',

    /** build tools supported by JHipster */
    buildTools: ['maven', 'gradle'],

    oracleLimitations: {
        tableNameHardMaxLength: 26,
        tableNameSoftMaxLength: 14
    },

    /** database types supported by JHipster */
    dbTypes: jhicore.JHipsterDatabaseTypes.Types,

    /** relationship types */
    relationshipTypes: jhicore.JHipsterRelationshipTypes.RELATIONSHIP_TYPES,

    /** supported types for sql databases */
    sqlTypes: jhicore.JHipsterFieldTypes.SQL_TYPES,

    /**
     * Original physical naming strategy used by JHipster. Used for search and replace.
     * @const
     * @type {string}
     */
    physicalNamingStrategyOld: 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy',

    /**
     * Original implicit naming strategy used by JHipster. Used for search and replace.
     * @const
     * @type {string}
     */
    implicitNamingStrategyOld: 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy',

    /**
     * A more neutral implicit naming strategy used by jhipster-db-helper.
     * [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/ImplicitNamingStrategyJpaCompliantImpl.java}
     * @const
     * @type {string}
     */
    implicitNamingStrategyNew: 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl',

    /**
     * A more neutral physical naming strategy used by jhipster-db-helper.
     * [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/PhysicalNamingStrategyStandardImpl.java}
     * @const
     * @type {string}
     */
    physicalNamingStrategyNew: 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl',

    /** modules name */
    moduleName: {
        postAppGenerator: 'db-helper',
        postEntityGenerator: 'fix-entity'
    },

    /* TEST CONSTANTS ***************************************************** */

    relationshipsSamples: {
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
    },

    /*
     * these objects must be STRICTLY equal to the files
     * 'templates/default/usingGradle/.yo-rc.json'
     * 'templates/default/usingMaven/.yo-rc.json'
     * otherwise tests fail despite a correct implementation
     */
    templateConfigFile: {
        usingGradle: {
            "generator-jhipster": {
                "baseName": "sampleMysql",
                "packageName": "com.mycompany.myapp",
                "packageFolder": "com/mycompany/myapp",
                "authenticationType": "session",
                "hibernateCache": "ehcache",
                "clusteredHttpSession": false,
                "websocket": false,
                "databaseType": "sql",
                "devDatabaseType": "h2Disk",
                "prodDatabaseType": "mysql",
                "searchEngine": false,
                "useSass": false,
                "buildTool": "gradle",
                "frontendBuilder": "grunt",
                "enableTranslation": true,
                "enableSocialSignIn": false,
                "rememberMeKey": "2bb60a80889aa6e6767e9ccd8714982681152aa5",
                "testFrameworks": [
                    "gatling"
                ],
                "jhipsterVersion": "4.3.0",
                "serverPort": "8080",
                "messageBroker": false,
                "serviceDiscoveryType": false,
                "clientFramework": "angular1",
                "clientPackageManager": "yarn",
                "applicationType": "monolith",
                "jhiPrefix": "jhi",
                "languages": []
            }
        },
        usingMaven: {
            "generator-jhipster": {
                "baseName": "sampleMysql",
                "packageName": "com.mycompany.myapp",
                "packageFolder": "com/mycompany/myapp",
                "authenticationType": "session",
                "hibernateCache": "ehcache",
                "clusteredHttpSession": false,
                "websocket": false,
                "databaseType": "sql",
                "devDatabaseType": "h2Disk",
                "prodDatabaseType": "mysql",
                "searchEngine": false,
                "useSass": false,
                "buildTool": "maven",
                "frontendBuilder": "grunt",
                "enableTranslation": true,
                "enableSocialSignIn": false,
                "rememberMeKey": "2bb60a80889aa6e6767e9ccd8714982681152aa5",
                "testFrameworks": [
                    "gatling"
                ],
                "jhipsterVersion": "4.3.0",
                "serverPort": "8080",
                "messageBroker": false,
                "serviceDiscoveryType": false,
                "clientFramework": "angular1",
                "clientPackageManager": "yarn",
                "applicationType": "monolith",
                "jhiPrefix": "jhi",
                "languages": []
            }
        }
    },

    // files for testing generators/app/index.js _replaceNamingStrategies
    templateFilesWithNamingStrategy: {
        usingGradle: [
            'templates/default/usingGradle/src/main/resources/config/application.yml',
            'templates/default/usingGradle/src/test/resources/config/application.yml',
            'templates/default/usingGradle/.yo-rc.json',
            'templates/default/usingGradle/gradle/liquibase.gradle'
        ],
        usingMaven: [
            'templates/default/usingMaven/src/main/resources/config/application.yml',
            'templates/default/usingMaven/src/test/resources/config/application.yml',
            'templates/default/usingMaven/.yo-rc.json',
            'templates/default/usingMaven/pom.xml'
        ],
    },

    testCases: {
        usingGradle: 'usingGradle',
        usingMaven:  'usingMaven'
    },

    testConfigDir: {
        usingGradle: '../test/templates/default/usingGradle',
        usingMaven:  '../test/templates/default/usingMaven'
    },

    testConfigFiles: {
        usingGradle: '../test/templates/default/usingGradle/.yo-rc.json',
        usingMaven:  '../test/templates/default/usingMaven/.yo-rc.json'
    }
};

module.exports = constants;
