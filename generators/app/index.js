// modules used by the generator
const generator = require('yeoman-generator');
const chalk = require('chalk');
const packagejs = require('../../package.json'); // gives access to the package.json data


// modules use by private db-helper functions
const fs = require('fs');
const DBH_CONSTANTS = require('../dbh-constants');
const dbh = require('../dbh.js');


// Stores JHipster variables
const jhipsterVar = {
    moduleName: 'db-helper'
};


// Stores JHipster functions
const jhipsterFunc = {};


module.exports = generator.extend({
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
    _replaceNamingStrategies() {
        // grab our files from the global space
        const files = DBH_CONSTANTS.filesWithNamingStrategy;

        const physicalOld = DBH_CONSTANTS.physicalNamingStrategyOld;
        const physicalNew = DBH_CONSTANTS.physicalNamingStrategyNew;

        const implicitOld = DBH_CONSTANTS.implicitNamingStrategyOld;
        const implicitNew = DBH_CONSTANTS.implicitNamingStrategyNew;

        // used to filter the files with naming strategy

        const removeGradleFiles = item => item !== './gradle/liquibase.gradle';
        const removeMavenFiles = item => item !== './pom.xml';
        let existingFiles = []; // files minus the not installed files

        // use a promise to get the current application config
        dbh.getApplicationConfig().then(
            // if promise is resolved,
            // get the build tool of the application config
            (promiseResponse) => {
                const buildTool = promiseResponse['generator-jhipster']['buildTool'];

                // filter the non-existing file(s)
                // ie : if app uses Maven, remove Gradle file(s)
                if (buildTool === 'maven') {
                    existingFiles = files.filter(removeGradleFiles);
                } else if (buildTool === 'gradle') {
                    existingFiles = files.filter(removeMavenFiles);
                } else {
                    throw new Error(`build tool ${buildTool} unknown`);
                }

                // check that each file exists
                // TODO: move to another promise
                existingFiles.forEach((path) => {
                    if (fs.existsSync(path)) {
                        this.log(`File ${chalk.cyan(path)} found`);
                        // 1) replace Spring physical naming strategy
                        jhipsterFunc.replaceContent(path, physicalOld, physicalNew);
                        // 2) replace Spring implicit naming strategy
                        jhipsterFunc.replaceContent(path, implicitOld, implicitNew);
                    } else {
                        // note : 'throw' should end the function here but doesn't do it
                        // meanwhile, use a return instead
                        this.log(`${path} doesn't exist!`);
                    }
                });
            },

            // if promise is rejected
            promiseError => this.log(promiseError)
        );
    },

    // check current project state, get configs, etc
    initializing: {
        compose() {
            // DEBUG : log where we are
            this.log(chalk.bold.yellow('initializing: compose'));

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
        this.log(chalk.bold.yellow('prompting'));

        const done = this.async();

        // user interaction on module call goes here
        const prompts = [];

        // call the prompts
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        });
    },

    // other Yeoman run loop steps would go here :

    // configuring() : Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default() : If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this.log(chalk.bold.yellow('writing'));

        // replace files with Spring's naming strategies
        this.log('db-helper replaces your naming strategies.');
        this._replaceNamingStrategies();

        // declarations done by jhipster-module
        this.baseName = jhipsterVar.baseName;
        this.packageName = jhipsterVar.packageName;
        this.angularAppName = jhipsterVar.angularAppName;
        this.clientFramework = jhipsterVar.clientFramework;
        this.clientPackageManager = jhipsterVar.clientPackageManager;
        const javaDir = jhipsterVar.javaDir;
        const resourceDir = jhipsterVar.resourceDir;
        const webappDir = jhipsterVar.webappDir;
        this.message = this.props.message;

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
    },

    // conflict() : Where conflicts are handled (used internally)

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this.log(chalk.bold.yellow('install'));

        let logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
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
        this.log(chalk.bold.yellow('End of db-helper generator'));
    }
});
