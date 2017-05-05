/** constants used by tests */

module.exports = {
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
