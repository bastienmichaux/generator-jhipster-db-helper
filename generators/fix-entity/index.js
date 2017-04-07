const generator = require('yeoman-generator'),
    chalk = require('chalk'),
    prompts = require('./prompts.js'),
    fs = require('fs');


const jhipsterVar = {
    moduleName: 'fix-entity'
};


const jhipsterFunc = {};


module.exports = generator.extend({
    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);
        this.entityConfig = this.options.entityConfig;
        this.defaultTableName = this.options.entityConfig.entityTableName;
        this.fields = this.options.entityConfig.data.fields;

        this.tableNameInput = null;
        this.columnsInput = [];

        /**
         * replaces the content of a file located by its prefix and suffix by a new value
         * doesn't take the old value into account
         *
         * @param file will be modified
         * @param prefix is before the value we want to change
         * @param suffix is after the value we want to change
         * @param value will replace the current value in between prefix and suffix
         */
        this.replaceContent = function (file, prefix, suffix, value) {
            // TODO May want to put escapeRegExp somewhere else
            /**
             * return a copy of str with all regex characters escaped
             *
             * @param str possibly contains regex characters
             * @returns {XML|*|string|void}
             */
            function escapeRegExp(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            }
            jhipsterFunc.replaceContent(file, escapeRegExp(prefix) + '.*' + escapeRegExp(suffix), prefix + value + suffix, true);
        };
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
        askForColumnsName: prompts.askForColumnsName
    },


    // other Yeoman run loop steps would go here :

    // configuring() : Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default() : If the method name doesn't match a priority, it will be pushed to this group.


    /**
     * After creating a new entity, replace the value of the table name.
     *
     * Allows consistent mapping with an existing database table without modifying JHipster's entity subgenerator.
     **/
    writing() {
        // DEBUG : log where we are
        this.log('writing');

        // wanted table name (replaces JHipster's automatically created table name)
        let desiredTableName = this.tableNameInput;

        // update the entity json file
        jhipsterFunc.updateEntityConfig(this.entityConfig.filename, 'entityTableName', desiredTableName);

        // The files where we must change the value
        const files = {
            // path of the entity Java ORM
            // something like : src/main/java/package/domain/Foo.java
            ORMFile: {
                path: jhipsterVar.javaDir + '/domain/' + this.entityConfig.entityClass + '.java',
                prefix: '@Table(name = "',
                suffix: '")'
            },
            // path of the Liquibase changelog file
            // something like : src/main/resources/config/liquibase/changelog/20150128232313_added_entity_Foo.xml
            liquibaseFile: {
                path: jhipsterVar.resourceDir + 'config/liquibase/changelog/' + this.entityConfig.data.changelogDate + '_added_entity_' + this.entityConfig.entityClass + '.xml',
                prefix: '<createTable tableName="',
                suffix: '">'
            }
        };

        // Replacing the values
        for (let file in files) {
            // hasOwnProperty to avoid inherited properties
            if (files.hasOwnProperty(file) && fs.existsSync(files[file]['path'])) {
                this.replaceContent(files[file]['path'], files[file]['prefix'], files[file]['suffix'], desiredTableName);
            } else if(files.hasOwnProperty(file)) {
                throw new Error('File not found (' + file + ': ' + files[file]['path'] + ')');
            }
        }
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
