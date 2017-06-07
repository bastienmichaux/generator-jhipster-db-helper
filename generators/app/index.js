const chalk = require('chalk');
const fs = require('fs');
const Generator = require('yeoman-generator');
const path = require('path');

const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants');
const packagejs = require('../../package.json'); // gives access to the package.json data

// Stores JHipster variables
const jhipsterVar = {
    moduleName: DBH_CONSTANTS.moduleName.postAppGenerator
};

// Stores JHipster functions
const jhipsterFunc = {};

// polyfill for jhipsterVar and jhipsterFunc when testing, see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19)
// TODO : refactor (no testing logic in production code)
const polyfill = {}; // eslint-disable-line no-unused-vars

Generator.prototype.log = (msg) => { console.log(msg); };

module.exports = class extends Generator {
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
        this.baseName = jhipsterVar.baseName || onFulfilled.baseName;
        this.packageName = jhipsterVar.packageName || onFulfilled.packageName;
        this.angularAppName = jhipsterVar.angularAppName || onFulfilled.angularAppName;
        this.clientFramework = jhipsterVar.clientFramework || onFulfilled.clientFramework;
        this.clientPackageManager = jhipsterVar.clientPackageManager || onFulfilled.clientPackageManager;
        this.message = this.props.message;
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
