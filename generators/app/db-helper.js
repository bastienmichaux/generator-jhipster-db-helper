// utility functions for generator-jhipster-db-helper

/**
 * TODOS :
 * - write proper JsDoc
 * - create an ensemble unit test
 * - replace 'console.log' with 'this.log'
 * - maybe replace the NPM module called 'replace' (I know, it's confusing) with lodash.replace function (but beware, this functions uses the arguments property).
 * Don't forget to run eslint !
 */

const chalk = require('chalk');
const replace = require('replace');
const fs = require('fs');
const Generator = require('yeoman-generator');


console.log("yo dawg");

/**
 * Configuration files in generator-jhipster that include the Spring naming strategies (as of JHipster 4.1.1).
 * These files are replaced by our module to avoid inconsistencies when mapping over an existing DB.
 * This constant could be dynamically initialized instead of being static. It isn't future-proof.
 * @constant
 * @todo Add relevant links (StackOverflow) to this doc
 * @type {string[]}
 */
const filesWithNamingStrategyPaths = [
    './pom.xml',
    './src/main/resources/config/application.yml',
    './src/test/resources/config/application.yml',
    './node_modules/generator-jhipster/generators/server/templates/gradle/_liquibase.gradle',
    './node_modules/generator-jhipster/generators/server/templates/src/main/resources/config/_application.yml',
    './node_modules/generator-jhipster/generators/server/templates/src/test/resources/config/_application.yml'
];


/**
 * Original physical naming strategy used by JHipster. Used for search and replace.
 * @const
 * @type {string}
 */
const physicalNamingStrategyOld = 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy';


/**
 * Original implicit naming strategy used by JHipster. Used for search and replace.
 * @const
 * @type {string}
 */
const implicitNamingStrategyOld = 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy';


/**
 * A more neutral implicit naming strategy used by Db-Helper
 * @const
 * @type {string}
 */
const implicitNamingStrategyNew = 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl';


/**
 * A more neutral physical naming strategy used by Db-Helper
 * @const
 * @type {string}
 */
const physicalNamingStrategyNew = 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl';


/** return true for a non-empty string */
const isTrueString = x => (typeof x === 'string' && x !== '');


module.exports = class extends Generator {
    x () {
        this.log ("Hooray!!!!");
    }

    /** We use this function as a DEBUG logger during development. Users shouldn't see it. */
    debugLog(pString) {
        if (isTrueString(pString)) {
            console.log(chalk.bold.yellow(`DBH-DEBUG: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    }

    /** We use this function to warn the user. */
    warnLog(pString) {
        if (isTrueString) {
            console.log(chalk.bold.red(`DBH-WARN: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    }

    /** Hooray ! Celebrate something. */
    successLog(pString) {
        if (isTrueString) {
            console.log(chalk.bold.green(`DBH-SUCCESS: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    }

    /**
     * Test if Spring naming strategies are replaced by our naming strategies
     * @todo Write unit test
     * @returns {Boolean}
     */
    namingStrategiesReplaced() {
        console.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        return false;
    }

    /**
     * Return an object with the entity name and all its variants (name, tableName, entityTableName, etc).
     * @todo Write unit test
     * @returns {Object}
     */
    getEntityNameVariations(pEntityName) {
        console.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        if (isTrueString(pEntityName)) {
            return false;
        } else {
            throw new TypeError(`pEntityName isn't a true string: type = ${typeof pEntityName} ; value = ${pEntityName}`);
        }
    }

    /**
     * replace Spring naming strategies with more neutral ones
     * return true if all occurrences are replaced
     *
     * note : after running this function, reference to the ancient naming strategies will still be found in :
     * ./node_modules/generator-jhipster/generators/server/templates/_pom.xml:
     * however this doesn't concern us
     *
     * @todo : write local test for the return value
     * @todo : write unit test
     */
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
                // note : 'throw' ends the function here
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


