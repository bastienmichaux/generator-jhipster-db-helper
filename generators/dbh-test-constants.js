/** constants used by tests */

module.exports = {
    templateConfigFile: {
        // this object must EXACTLY be the object representation of the files
        // 'templates/default/usingMaven/.yo-rc.json'
        // otherwise tests fail
        usingGradle: {
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
                "buildTool": "gradle",
                "frontendBuilder": "grunt",
                "enableTranslation": true,
                "enableSocialSignIn": false,
                "rememberMeKey": "2bb60a80889aa6e6767e9ccd8714982681152aa5",
                "testFrameworks": [
                    "gatling"
                ]
            }
        },
        usingMaven: {
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
    }
};
