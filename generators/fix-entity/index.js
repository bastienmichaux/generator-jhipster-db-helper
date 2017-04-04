// modules used by the generator
const generator = require('yeoman-generator');
const assert = require('yeoman-assert');
const chalk = require('chalk');
const prompts = require('./prompts.js');

const replace = require('replace');
const fs = require('fs');

const jhipsterVar = {
    moduleName: 'fix-entity '
};
const jhipsterFunc = {};

module.exports = generator.extend({
    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);
        this.entityConfig = this.options.entityConfig;
        this.defaultTableName = this.options.entityConfig.entityClass;
    },
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
    prompting: {
        askForTableName: prompts.askForTableName,
        askForColumnName: prompts.askForColumnName
    },

    // other Yeoman run loop steps would go here :

    // configuring() : Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default() : If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this.log('writing');

        let ORMFile = jhipsterVar.javaDir + '/domain/' + this.entityConfig.entityClass + '.java';
        let liquiFile = jhipsterVar.resourceDir + 'config/liquibase/changelog/' + this.entityConfig.data.changelogDate + '_added_entity_' + this.entityConfig.entityClass + '.xml';
        let desiredTableName = this.defaultTableName;

        assert.file([ORMFile, liquiFile]);

        let prefix = '@Table\\(name = "';
        let suffix = '"\\)';

        replace({
            regex: prefix + '.*' + suffix,
            replacement: prefix.replace('\\', '') + desiredTableName + suffix.replace('\\', ''),
            paths: [ORMFile],
            recursive: false,
            silent: true,
        });

        prefix = '<createTable tableName="';
        suffix = '">';

        replace({
            regex: prefix + '.*' + suffix,
            replacement: prefix + desiredTableName + suffix,
            paths: [liquiFile],
            recursive: false,
            silent: true,
        });

        //jhipsterFunc.updateEntityConfig(this.entityConfig.filename, 'entityTableName', desiredTableName);
    },

    // conflict() : Where conflicts are handled (used internally)

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this.log('install');
    },

    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this.log('End of fix-entity generator');
    }
});
