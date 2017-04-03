/**
 * TODOS :
 * - write proper JsDoc
 * - create an ensemble unit test
 * - replace 'console.log' with 'this.log'
 * - maybe replace the NPM module called 'replace' (I know, it's confusing) with lodash.replace function (but beware, this functions uses the arguments property).
 * Don't forget to run eslint !
 */

// modules used by the generator
const generator = require('yeoman-generator');
const chalk = require('chalk');
const packagejs = require('../../package.json'); // gives access to the package.json data


// modules use by private db-helper functions
const replace = require('replace');
const fs = require('fs');


// Stores JHipster variables
const jhipsterVar = {
    moduleName: 'db-helper'
};


// Stores JHipster functions
const jhipsterFunc = {};


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


module.exports = generator.extend({
    /** We use this function as a DEBUG logger during development. Users shouldn't see it. */
    _debugLog (pString) {
        if (isTrueString(pString)) {
            this.log(chalk.bold.yellow(`DBH-DEBUG: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    },

    /** We use this function to warn the user. */
    _warnLog (pString) {
        if (isTrueString) {
            this.log(chalk.bold.red(`DBH-WARN: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    },

    /** Hooray ! Celebrate something. */
    _successLog (pString) {
        if (isTrueString) {
            this.log(chalk.bold.green(`DBH-SUCCESS: ${pString}`));
        } else {
            throw new TypeError(
                chalk.red(`DBH: pString isn't a true string: type = ${typeof pString} ; value = ${pString}`)
            );
        }
    },

    /**
     * Test if Spring naming strategies are replaced by our naming strategies
     * @todo Write unit test
     * @returns {Boolean}
     */
    _namingStrategiesReplaced () {
        this.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        return false;
    },

    /**
     * Return an object with the entity name and all its variants (name, tableName, entityTableName, etc).
     * @todo Write unit test
     * @returns {Object}
     */
    _getEntityNameVariations (pEntityName) {
        this.log(chalk.bold.red('getEntityNameVariations NOT IMPLEMENTED YET !'));
        if (isTrueString(pEntityName)) {
            return false;
        } else {
            throw new TypeError(`pEntityName isn't a true string: type = ${typeof pEntityName} ; value = ${pEntityName}`);
        }
    },

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
    _replaceNamingStrategies () {
        // grab our files from the global space
        const files = filesWithNamingStrategyPaths;

        const physicalOld = physicalNamingStrategyOld;
        const physicalNew = physicalNamingStrategyNew;

        const implicitOld = implicitNamingStrategyOld;
        const implicitNew = implicitNamingStrategyNew;

        // check that each file exists
        files.forEach((path) => {
            if (fs.existsSync(path)) {
                this.log(`File ${chalk.cyan(path)} exists`);
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
    },

    // check current project state, get configs, etc
    initializing: {
        compose() {
            // DEBUG : log where we are
            this._debugLog('initializing: compose');

            this.composeWith('jhipster:modules',
                { jhipsterVar, jhipsterFunc },
                this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
            );
        },
        displayLogo() {
            // Have Yeoman greet the user.
            this.log(`${chalk.bold.yellow('JHipster db-helper')} generator ${chalk.yellow(`v${packagejs.version}\n`)}`);
        }
    },

    // prompt the user for options
    prompting() {
        // DEBUG : log where we are
        this._debugLog('prompting');

        const done = this.async();

        // user interaction on module call goes here
        const prompts = [
            {
                type: 'input',
                name: 'message',
                message: 'Please put something',
                default: 'hello world!'
            }
        ];

        // call the prompts
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        });
    },

    // other Yeoman run loop steps would go here :

    // configuring: Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default: If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this._debugLog('writing');

        // replace files with Spring's naming strategies
        this.log('db-helper replaces your naming strategies.');
        this._replaceNamingStrategies();

        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        this.baseName = jhipsterVar.baseName;
        this.packageName = jhipsterVar.packageName;
        this.angularAppName = jhipsterVar.angularAppName;
        this.clientFramework = jhipsterVar.clientFramework;
        this.clientPackageManager = jhipsterVar.clientPackageManager;
        const javaDir = jhipsterVar.javaDir;
        const resourceDir = jhipsterVar.resourceDir;
        const webappDir = jhipsterVar.webappDir;

        this.message = this.props.message;

        this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`angularAppName=${this.angularAppName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);
        this.log(`\nmessage=${this.message}`);
        this.log('------\n');

        this.template('dummy.txt', 'dummy.txt');
        /*
        try {
            jhipsterFunc.registerModule('generator-jhipster-db-helper', 'app', 'post', 'app', 'A JHipster module for already existing databases');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }
        */
    },

    // Where conflicts are handled (used internally)
    // conflict() {}

    // run installation (npm, bower, etc)
    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        // DEBUG : log where we are
        this._debugLog('install');

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        this.installDependencies(installConfig);
    },

    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this._debugLog('end');

        this.log('End of db-helper generator');
    }
});
