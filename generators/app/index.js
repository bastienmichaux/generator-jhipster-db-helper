const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                /**
                 * dbhTestCase: Option used to make unit tests in temporary directories instead of the current directory.
                 * The passed string argument references constants.
                 * those constants can be found in dbh-constants.js.
                 */
                this.option('dbhTestCase', {
                    desc: 'Test case for this module\'s npm test',
                    type: String,
                    defaults: ''
                });

                this.dbhTestCase = this.options.dbhTestCase;
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster db-helper')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }
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
        } else if (DBH_CONSTANTS.testCases[testCase] !== undefined) {
            filePath = path.join(__dirname, '..', DBH_CONSTANTS.testConfigFiles[testCase]);
        } else {
            throw new Error(`_getConfigFilePath: testCase parameter: not a test case we know of. testCase was: ${testCase}`);
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`_getConfigFilePath: Sought after this file, but it doesn't exist. Path was:\n${filePath}`);
        }

        return filePath;
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
        files.forEach((file) => {
            if (fs.existsSync(file)) {
                // 1) replace Spring physical naming strategy
                this.replaceContent(file, physicalOld, physicalNew, null);
                // 2) replace Spring implicit naming strategy
                this.replaceContent(file, implicitOld, implicitNew, null);
            } else {
                throw new Error(`_replaceNamingStrategies: File doesn't exist! Path was:\n${file}`);
            }
        });
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
        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // variable from questions
        this.message = this.props.message;

        this._replaceNamingStrategies(this.buildTool);

        try {
            this.registerModule('generator-jhipster-db-helper', 'app', 'post', 'app', 'A JHipster module for already existing databases');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }

        try {
            this.registerModule('generator-jhipster-db-helper', 'entity', 'post', 'fix-entity', 'A JHipster module to circumvent JHipster limitations about names');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }
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
