// utility functions for generator-jhipster-db-helper

/**
 * TODOS :
 * - Write proper JsDoc
 * - Replace 'console.log' with 'this.log'
 * Don't forget to run eslint !
 */


// imports

const chalk = require('chalk');
const replace = require('replace');
const fs = require('fs');


// constants

// This module replaces Spring naming strategies with other strategies (to prevent renaming entities)
// The following assumes that the pertinent configuration files are there and with these current naming strategy.
// this is true with jhipster v4.1.1
const filesWithNamingStrategyPaths = ['./pom.xml', './src/main/resources/config/application.yml', './src/test/resources/config/application.yml'];

// physical naming strategies
const physicalNamingStrategyOld = 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy';
const physicalNamingStrategyNew = 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl';

// implicit naming strategies
const implicitNamingStrategyOld = 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy';
const implicitNamingStrategyNew = 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl';

// return true for a non-empty string
const isTrueString = x => (typeof x === 'string' && x !== '');

module.exports = {

    // use this function as a DEBUG logger
    debugLog(pString) {
        if (isTrueString) {
            console.log(chalk.bold.green(`DBH-DEBUG: ${pString}`));
        } else {
            // log obvious, shameful mistake
            console.log(chalk.bold.red('debugLog : bad parameter !'));
            console.log(chalk.red(`pString : type = ${typeof pString}, value = ${pString}`));
        }
    },

    // test if Spring naming strategies are replaced by our naming strategies
    // return a boolean
    // TODO : write test
    namingStrategiesReplaced() {
        console.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        return false;
    },

    // return an object with the entity name and all variants :
    // name, tableName, entityTableName, etc
    // TODO : write test
    getEntityNameVariations(pEntityName) {
        console.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        return false;
    },

    // replace Spring naming strategies with more neutral ones
    // return true if all occurrences are replaced
    // TODO : write test
    replaceNamingStrategies() {
        // grab our files from the global space
        const files = filesWithNamingStrategyPaths;

        const physicalOld = physicalNamingStrategyOld;
        const physicalNew = physicalNamingStrategyNew;

        const implicitOld = implicitNamingStrategyOld;
        const implicitNew = implicitNamingStrategyNew;

        // check that each file exists
        files.forEach((path) => {
            if (fs.existsSync(path)) {
                console.log(`File ${chalk.cyan(path)} exists`);
            } else {
                throw new Error(`${path} doesn't exist!`);
            }
        });

        // replace the files :

        // 1) replace Spring physical naming strategy
        replace({
            regex: physicalOld,
            replacement: physicalNew,
            paths: files,
            recursive: false,
            silent: true,
        });

        // 2) replace Spring implicit naming strategy
        replace({
            regex: implicitOld,
            replacement: implicitNew,
            paths: files,
            recursive: false,
            silent: true,
        });

        return false;
    }
};
