// modules used by the generator
const chalk = require('chalk');
const fs = require('fs');
const Generator = require('yeoman-generator');
const path = require('path');

// modules use by private db-helper functions
const BaseGenerator = require('../../node_modules/generator-jhipster/generators/generator-base.js');
const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants');
const DBH_TEST_CONSTANTS = require('../../test/test-constants.js');
const jhipsterModuleSubgenerator = require('../../node_modules/generator-jhipster/generators/modules/index.js');
const packagejs = require('../../package.json'); // gives access to the package.json data

BaseGenerator.prototype.log = (msg) => { console.log(msg); };

// Stores JHipster variables
const jhipsterVar = {
    moduleName: DBH_CONSTANTS.moduleName
};

// Stores JHipster functions
const jhipsterFunc = {};

// polyfill for jhipsterVar and jhipsterFunc when testing, see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19)
let polyfill = {};

module.exports = class extends Generator {
    /** duplicate of a JHipster function where we have replaced how the path is handled, because we use absolute paths */
    _replaceContent (filePath, pattern, content, regex) {
        function dbh_replaceContent(args, generator) {
            args.path = args.path || process.cwd();

            // this line has been modified in respect to jhipster's util.js replaceContent
            // because we use absolute paths
            const fullPath = args.file;

            const re = args.regex ? new RegExp(args.pattern, 'g') : args.pattern;

            let body = generator.fs.read(fullPath);
            body = body.replace(re, args.content);
            generator.fs.write(fullPath, body);
        }

        dbh_replaceContent({
            file: filePath,
            pattern,
            content,
            regex
        }, this);
    }

    /**
     * get the absolute path of the config file .yo-rc.json
     * when testing with npm test, this function returns a config file for the given test case
     * when used normally, this function returns the current application .yo-rc.json
     */
    _getConfigFilePath (testCase) {    let filePath = null;
        if (typeof testCase !== 'string') {
            throw new TypeError(`_getConfigFilePath: testCase parameter: expected type 'string', was instead '${typeof testCase}'`);
        }

        if (testCase === null) {
            filePath = path.join(__dirname, '/.yo-rc.json');
        }
        else if (testCase === DBH_TEST_CONSTANTS.testCases.usingMaven) {
            filePath = path.join(__dirname, '../..', DBH_TEST_CONSTANTS.testConfigFiles.usingMaven);
        }
        else if (testCase === DBH_TEST_CONSTANTS.testCases.usingGradle) {
            filePath = path.join(__dirname, '../..', DBH_TEST_CONSTANTS.testConfigFiles.usingGradle);
        }
        else {
            throw new Error(`_getConfigFilePath: testCase parameter: not a test case we know of: ${testCase}`);
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`_getConfigFilePath: Sought after this file, but it doesn't exist: ${filePath}`);
        }

        return filePath;
    }

    /**
     * get a polyfill for the jhipsterVar and jhipsterFunc properties gone missing when testing
     * because of a [yeoman-test](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19) issue
     *
     * @param {string} appConfigPath - path to the current .yo-rc.json application file
     */
    _getPolyfill (appConfigPath) {
        // stop if file not found
        if (!fs.existsSync(appConfigPath)) {
            throw new Error(`_getPolyfill: File ${appConfigPath} not found`);
        }

        // else return a promise holding the polyfill
        return dbh.getAppConfig(appConfigPath)
        .catch(err => console.error(err))
        .then((onResolve) => {
            const conf = onResolve['generator-jhipster'];
            const poly = {};

            // @todo: defensive programming with these properties (hasOwnProperty ? throw ?)

            // jhipsterVar polyfill :

            poly.baseName = conf.baseName;
            poly.packageName = conf.packageName;
            poly.angularAppName = conf.angularAppName || null; // handle an undefined value
            poly.clientFramework = conf.clientFramework;
            poly.clientPackageManager = conf.clientPackageManager;
            poly.buildTool = conf.buildTool;

            // jhipsterFunc polyfill :
            poly.registerModule = jhipsterModuleSubgenerator.prototype.registerModule;
            poly.updateEntityConfig = jhipsterModuleSubgenerator.prototype.updateEntityConfig;

            // @todo : handle this.options.testMode ?

            return poly;
        }, onError => console.error(onError));
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
     * @todo : no hardcoded values for removeGradleFiles and removeMavenFiles
     */
    _replaceNamingStrategies (appBuildTool) {
        const physicalOld = DBH_CONSTANTS.physicalNamingStrategyOld;
        const physicalNew = DBH_CONSTANTS.physicalNamingStrategyNew;

        const implicitOld = DBH_CONSTANTS.implicitNamingStrategyOld;
        const implicitNew = DBH_CONSTANTS.implicitNamingStrategyNew;

        const files = dbh.getFilesWithNamingStrategy(appBuildTool);

        const getFilesAbsolutePath = () => {
            let arr = [];

            if (this.dbhTestCase !== null) {
                files.forEach((value) => {
                    arr.push(path.join(DBH_TEST_CONSTANTS.testConfigDir[this.dbhTestCase], value));
                });
            }

            else {
                files.forEach((value) => {
                    arr.push(path.join(__dirname, value));
                });
            }

            return arr;
        };

        const filesWithAbsolutePath = getFilesAbsolutePath();

        // check that each file exists, then replace the naming strategies
        files.forEach((path) => {
            if (fs.existsSync(path)) {
                // 1) replace Spring physical naming strategy
                this._replaceContent(path, physicalOld, physicalNew);
                // 2) replace Spring implicit naming strategy
                this._replaceContent(path, implicitOld, implicitNew);
            } else {
                throw new Error(`${path} doesn't exist!`);
            }
        });
    }

    constructor(args, opts) {
        super(args, opts);

        this.option('dbhTestCase', {
            desc: 'Test case for this module\'s npm test',
            type: String,
            defaults: null
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

        const configFile = this._getConfigFilePath(this.dbhTestCase); //path.join(__dirname, '/.yo-rc.json');
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

        this._getPolyfill(configFile)
        .then(
            onFulfilled => {
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

                // declarations done by jhipster-module
                this.baseName = jhipsterVar.baseName || polyfill.baseName;
                this.packageName = jhipsterVar.packageName || polyfill.packageName;
                this.angularAppName = jhipsterVar.angularAppName || polyfill.angularAppName;
                this.clientFramework = jhipsterVar.clientFramework || polyfill.clientFramework;
                this.clientPackageManager = jhipsterVar.clientPackageManager || polyfill.clientPackageManager;
                this.message = this.props.message;

                try {
                    jhipsterFunc.registerModule('generator-jhipster-db-helper', 'app', 'post', 'app', 'A JHipster module for already existing databases');
                } catch (err) {
                    this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
                    console.error(err);
                }

                try {
                    jhipsterFunc.registerModule('generator-jhipster-db-helper', 'entity', 'post', 'fix-entity', 'A JHipster module to circumvent JHipster limitations about names');
                } catch (err) {
                    this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
                    console.error(err);
                }


                // replace files with Spring's naming strategies
                this.log(chalk.bold.yellow('JHipster-db-helper replaces your naming strategies :'));
                this._replaceNamingStrategies(buildTool);
            },
            onRejected => {
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
