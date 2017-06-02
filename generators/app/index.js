const chalk = require('chalk');
const fs = require('fs');
const Generator = require('yeoman-generator');
const path = require('path');

const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants');
const DBH_TEST_CONSTANTS = require('../../test/test-constants.js');
const jhipsterModuleSubgenerator = require('../../node_modules/generator-jhipster/generators/modules/index.js');
const packagejs = require('../../package.json'); // gives access to the package.json data

// Stores JHipster variables
const jhipsterVar = {
    moduleName: DBH_CONSTANTS.moduleName.postAppGenerator
};

// Stores JHipster functions
const jhipsterFunc = {};

// polyfill for jhipsterVar and jhipsterFunc when testing, see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19)
// TODO : refactor (no testing logic in production code)
const polyfill = {};

Generator.prototype.log = (msg) => { console.log(msg); };

module.exports = class extends Generator {
    // TODO : refactor (no testing logic in production code)
    /**
     * Get the absolute path of the config file .yo-rc.json.
     * When used normally, this function returns the current application's .yo-rc.json.
     * When testing, this function returns the config file for the given test case, which is a constant.
     */
    _getConfigFilePath(testCase) {
        let filePath = null;

        if (typeof testCase !== 'string') {
            throw new TypeError(`_getConfigFilePath: testCase parameter: expected type 'string', was instead '${typeof testCase}'`);
        }

        // set filePath depending on whether the generator is running a test case or not
        if (testCase === '') {
            filePath = path.join(process.cwd(), '/.yo-rc.json');
        } else if (DBH_TEST_CONSTANTS.testCases[testCase] !== undefined) {
            filePath = path.join(__dirname, '../..', DBH_TEST_CONSTANTS.testConfigFiles[testCase]);
        } else {
            throw new Error(`_getConfigFilePath: testCase parameter: not a test case we know of. testCase was: ${testCase}`);
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`_getConfigFilePath: Sought after this file, but it doesn't exist. Path was:\n${filePath}`);
        }

        return filePath;
    }

    // TODO : refactor (no testing logic in production code)
    /**
     * Get a polyfill for the jhipsterVar and jhipsterFunc properties gone missing when testing
     * because of a [yeoman-test](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19) issue.
     *
     * @param {string} appConfigPath - path to the current .yo-rc.json application file
     */
    _getPolyfill(appConfigPath) {
        // stop if file not found
        if (!fs.existsSync(appConfigPath)) {
            throw new Error(`_getPolyfill: File ${appConfigPath} not found`);
        }

        // else return a promise holding the polyfill
        return dbh.getAppConfig(appConfigPath)
        .then(
            (onResolve) => {
                const conf = onResolve['generator-jhipster'];
                const poly = {};

                // @todo: defensive programming with these properties (hasOwnProperty ? throw ?)

                // jhipsterVar polyfill :
                poly.baseName = conf.baseName;
                poly.packageName = conf.packageName;
                poly.angularAppName = conf.angularAppName || null; // handle an undefined value (JSON properties can't be undefined)
                poly.clientFramework = conf.clientFramework;
                poly.clientPackageManager = conf.clientPackageManager;
                poly.buildTool = conf.buildTool;

                // jhipsterFunc polyfill :
                poly.registerModule = jhipsterModuleSubgenerator.prototype.registerModule;
                poly.updateEntityConfig = jhipsterModuleSubgenerator.prototype.updateEntityConfig;

                // @todo : handle this.options.testMode ?

                return poly;
            },
            (onError) => {
                throw new Error(onError);
            }
        );
    }

    /**
     * Replace Spring naming strategies with more neutral ones.
     *
     * Note : after running this function, a reference to the ancient naming strategies will still be found in :
     * ./node_modules/generator-jhipster/generators/server/templates/_pom.xml
     * however this doesn't concern us
     */
    _replaceNamingStrategies(appBuildTool) {
        const physicalOld = DBH_CONSTANTS.physicalNamingStrategyOld;
        const physicalNew = DBH_CONSTANTS.physicalNamingStrategyNew;

        const implicitOld = DBH_CONSTANTS.implicitNamingStrategyOld;
        const implicitNew = DBH_CONSTANTS.implicitNamingStrategyNew;

        // depending on the application's build tool, get all files where the old naming strategies must be replaced
        const files = dbh.getFilesWithNamingStrategy(appBuildTool);

        // check that each file exists, then replace the naming strategies
        files.forEach((path) => {
            if (fs.existsSync(path)) {
                // 1) replace Spring physical naming strategy
                dbh.replaceContent(path, physicalOld, physicalNew, null, this);
                // 2) replace Spring implicit naming strategy
                dbh.replaceContent(path, implicitOld, implicitNew, null, this);
            } else {
                throw new Error(`_replaceNamingStrategies: File doesn't exist! Path was:\n${path}`);
            }
        });
    }

    constructor(args, opts) {
        super(args, opts);

        // Option used to make unit tests in temporary directories instead of the current directory.
        // The passed string argument references constants,
        // those constants can be found in test/test-constants.js.
        this.option('dbhTestCase', {
            desc: 'Test case for this module\'s npm test',
            type: String,
            defaults: ''
        });

        this.dbhTestCase = this.options.dbhTestCase;
    }

    // check current project state, get configs, etc
    initializing() {
        // Have Yeoman greet the user.
        this.log(chalk.bold.green(`JHipster db-helper generator v${packagejs.version}`));

        // note : before this line we can't use jhipsterVar or jhipsterFunc
        this.composeWith('jhipster:modules',
            { jhipsterVar, jhipsterFunc },
            this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
        );
    }

    // prompt the user for options
    prompting() {
        const done = this.async();

        // user interaction on module call goes here
        const prompts = [];

        // call the prompts
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        });
    }

    // write the generator-specific files
    writing() {
        const configFile = this._getConfigFilePath(this.dbhTestCase);

        // TODO : refactor (no testing logic in production code)
        this._getPolyfill(configFile)
        .then(
            (onFulfilled) => {
                // direct assignment avoids a left-hand side object property assignment bug
                // See: https://stackoverflow.com/questions/26288963/weird-behaviour-with-use-strict-and-read-only-properties

                // jhipsterVar properties
                polyfill.baseName = onFulfilled.baseName;
                polyfill.packageName = onFulfilled.packageName;
                polyfill.angularAppName = onFulfilled.angularAppName;
                polyfill.clientFramework = onFulfilled.clientFramework;
                polyfill.clientPackageManager = onFulfilled.clientPackageManager;
                polyfill.buildTool = onFulfilled.buildTool;

                // jhipsterFunc properties
                polyfill.registerModule = onFulfilled.registerModule;
                polyfill.updateEntityConfig = onFulfilled.updateEntityConfig;

                // polyfill jhipsterFunc.registerModule
                if (jhipsterFunc.registerModule === undefined) {
                    jhipsterFunc.registerModule = polyfill.registerModule;
                }

                const buildTool = jhipsterVar.jhipsterConfig === undefined
                ? polyfill.buildTool
                : jhipsterVar.jhipsterConfig.buildTool;

                // declarations done by jhipster-module, polyfill in case of testing
                this.baseName = jhipsterVar.baseName || polyfill.baseName;
                this.packageName = jhipsterVar.packageName || polyfill.packageName;
                this.angularAppName = jhipsterVar.angularAppName || polyfill.angularAppName;
                this.clientFramework = jhipsterVar.clientFramework || polyfill.clientFramework;
                this.clientPackageManager = jhipsterVar.clientPackageManager || polyfill.clientPackageManager;
                this.message = this.props.message;

                // TODO : fix the following error when using jhipsterFunc.registerModule:
                // 'TypeError: this.log is not a function'

                try {
                    jhipsterFunc.registerModule('generator-jhipster-db-helper', 'app', 'post', 'app', 'A JHipster module for already existing databases');
                } catch (err) {
                    this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
                }

                try {
                    jhipsterFunc.registerModule('generator-jhipster-db-helper', 'entity', 'post', 'fix-entity', 'A JHipster module to circumvent JHipster limitations about names');
                } catch (err) {
                    this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
                }

                // replace files with Spring's naming strategies
                this.log(chalk.bold.yellow('JHipster-db-helper replaces your naming strategies :'));
                this._replaceNamingStrategies(buildTool);
            },
            (onRejected) => {
                throw new Error(onRejected);
            }
        );
    }

    // run installation (npm, bower, etc)
    install() {
        let logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }

        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.log('Install of dependencies failed!');
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
    }

    // cleanup, say goodbye
    end() {
        this.log(chalk.bold.yellow('End of db-helper generator'));
    }
};
 