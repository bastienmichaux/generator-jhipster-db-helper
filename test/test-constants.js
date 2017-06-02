/** constants used by tests */

module.exports = {
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
        usingGradle: 'test/templates/default/usingGradle',
        usingMaven:  'test/templates/default/usingMaven'
    },

    testConfigFiles: {
        usingGradle: 'test/templates/default/usingGradle/.yo-rc.json',
        usingMaven:  'test/templates/default/usingMaven/.yo-rc.json'
    }
};
