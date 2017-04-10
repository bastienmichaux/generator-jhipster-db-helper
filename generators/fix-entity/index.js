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
        this.defaultTableName = this.options.entityConfig.entityClass;
        this.fields = this.options.entityConfig.data.fields;

        this.tableNameInput = null; // will contain the name for @Table
        this.columnsInput = []; // will contain an object {fieldName:string, columnName:string}
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
        const log = this.log;
        // DEBUG : log where we are
        this.log('writing');

        this.log(chalk.red('PRINTING ENTITY'));
        this.log(this.entityConfig);
        this.log(chalk.red('PRINTING FIELDS'));
        this.log(this.fields);

        /**
         *
         * @param files object which each member is a file in the form of {path: string, prefix: string, suffix: string}
         * @param userInput the value which will replace whatever is between the matching prefix and suffix for each file.
         */
        function injectUserInput(files, userInput) {
            /**
             * replaces the content of a file located by its prefix and suffix by a new value
             * doesn't take the old value into account
             *
             * @param file will be modified
             * @param prefix is before the value we want to change
             * @param suffix is after the value we want to change
             * @param value will replace the current value in between prefix and suffix
             */
            function replaceContent(file, prefix, suffix, value) {
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
            }

            // Replacing the values
            for (var file in files) {
                // hasOwnProperty to avoid inherited properties
                if (files.hasOwnProperty(file) && fs.existsSync(files[file].path)) {
                    replaceContent(files[file].path, files[file].prefix, files[file].suffix, userInput);
                } else if(files.hasOwnProperty(file)) {
                    throw new Error('File not found (' + file + ': ' + files[file].path + ')');
                }
            }

        }

        const files = {
            config: '.jhipster/' + this.defaultTableName + '.json',
            ORM: jhipsterVar.javaDir + '/domain/' + this.entityConfig.entityClass + '.java',
            liquibase: jhipsterVar.resourceDir + 'config/liquibase/changelog/' + this.entityConfig.data.changelogDate + '_added_entity_' + this.entityConfig.entityClass + '.xml'
        };

        // Update the tableName
        jhipsterFunc.replaceContent(files.config, '"entityTableName": "' + this.defaultTableName, '"entityTableName": "' + this.tableNameInput);
        jhipsterFunc.replaceContent(files.ORM, '@Table(name = "' + this.defaultTableName, '@Table(name = "' + this.tableNameInput);
        jhipsterFunc.replaceContent(files.liquibase, '<createTable tableName="' + this.defaultTableName, '<createTable tableName="' + this.tableNameInput);

        // Add/update the columnName for each field
        this.columnsInput.forEach(function (columnItem) {
            const matchConfig = '"fieldName": "' + columnItem.fieldName + '"';
            if(columnItem.oldColumnName === undefined) {
                // We add columnName under fieldName
                log(chalk.blue('ADDING columnName ' + columnItem.newColumnName + 'for ' + columnItem.fieldName));
                jhipsterFunc.replaceContent(files.config, matchConfig, matchConfig + ',\n"columnName": "' + columnItem.newColumnName + '"');
            } else {
                // We update existing columnName
                log(chalk.blue('UPDATING columnName for ' + columnItem.fieldName));
                jhipsterFunc.replaceContent(files.config, '"columnName": "' + columnItem.oldColumnName, '"columnName": "' + columnItem.newColumnName);
            }
            // jhipsterFunc.replaceContent(files.ORM, '@Table(name = "' + this.defaultTableName, '@Table(name = "' + this.tableNameInput);
            // jhipsterFunc.replaceContent(files.liquibase, '<createTable tableName="' + this.defaultTableName, '<createTable tableName="' + this.tableNameInput);
        });

        // TODO dynamicly generate the replacement tasks

        // injectUserInput(files, this.defaultTableName + '.json'); TODO
		// TODO replace values
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
