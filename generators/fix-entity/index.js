// modules used by the generator
const generator = require('yeoman-generator');
const chalk = require('chalk');

const replace = require('replace');
const fs = require('fs');

const jhipsterVar = {
    moduleName: 'fix-entity '
};
const jhipsterFunc = {};

module.exports = generator.extend({
    // check current project state, get configs, etc
    initializing() {
        this.log('fix-entity generator');
        this.log('initializing');
		this.composeWith('jhipster:modules',
			{ jhipsterVar, jhipsterFunc },
			this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
		);
    },

    // prompt the user for options
    prompting() {
        // DEBUG : log where we are
        this.log('prompting');

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

    // configuring: Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default: If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this.log('writing');
        let wantedValue = this.options.entityConfig.entityClass;
        let ORMFile = jhipsterVar.javaDir + '/domain/' + this.options.entityConfig.entityClass + '.java';

        if (fs.existsSync(ORMFile)) {
            this.log(`File ${chalk.cyan(ORMFile)} found`);
            let prefix = '@Table\\(name = "';
            let suffix = '"\\)';

            replace({
                regex: prefix + '.*' + suffix,
                replacement: prefix.replace('\\', '') + wantedValue + suffix.replace('\\', ''),
                paths: [ORMFile],
                recursive: false,
                silent: true,
            });
        } else {
            throw new Error(`${ORMFile} doesn't exist!`);
        }

        jhipsterFunc.updateEntityConfig(this.options.entityConfig.filename, 'entityTableName', wantedValue);
    },

    // Where conflicts are handled (used internally)
    // conflict() {}

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this.log('install');
    },

    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this.log('End of fix-entity generator');
    },
});
