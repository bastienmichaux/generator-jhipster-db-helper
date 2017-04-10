const generator = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('./prompts.js');
const fs = require('fs');


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

        /* / TODO remove on prod
        this.log(chalk.blue('entityConfig'));
        this.log(this.entityConfig);
        this.log(chalk.blue('fields'));
        this.log(this.fields);
        this.log(chalk.blue('jhipsterVar'));
        this.log(jhipsterVar);
        //*/
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

        const files = {
            config: this.entityConfig.filename,
            ORM: `${jhipsterVar.javaDir}/domain/${this.entityConfig.entityClass}.java`,
            liquibase: `${jhipsterVar.resourceDir}config/liquibase/changelog/${this.entityConfig.data.changelogDate}_added_entity_${this.entityConfig.entityClass}.xml`
        };

        // Update the tableName
        this.log(this.entityConfig);
        this.log(this.fs.readJSON(files.config));
        this.log(chalk.blue('table name from ' + this.entityConfig.entityTableName + ' to ' + this.tableNameInput));
        jhipsterFunc.replaceContent(files.config, '"entityTableName": "' + this.entityConfig.entityTableName, '"entityTableName": "' + this.tableNameInput);
        jhipsterFunc.replaceContent(files.ORM, '@Table(name = "' + this.entityConfig.entityTableName, '@Table(name = "' + this.tableNameInput);
        jhipsterFunc.replaceContent(files.liquibase, '<createTable tableName="' + this.entityConfig.entityTableName, '<createTable tableName="' + this.tableNameInput);

        // Add/update the columnName for each field
        this.columnsInput.forEach((columnItem) => {
            const fieldNameMatch = `"fieldName": "${columnItem.fieldName}"`;

            if (columnItem.columnName === undefined) {
                // We add columnName under fieldName
                log(chalk.blue(`(${columnItem.fieldName}) ADDING columnName ${columnItem.newColumnName}`));
                // '(\\s*)' is for capturing indentation
                jhipsterFunc.replaceContent(files.config, '(\\s*)' + fieldNameMatch, '$1' + fieldNameMatch + ',$1"columnName": "' + columnItem.newColumnName + '"', true);
            } else if(columnItem.columnName != columnItem.newColumnName){
                // We update existing columnName
                log(chalk.blue('(' + columnItem.fieldName + ') UPDATING columnName from ' + columnItem.columnName + ' to ' + columnItem.newColumnName));
                jhipsterFunc.replaceContent(files.config, '"columnName": "' + columnItem.columnName, '"columnName": "' + columnItem.newColumnName);
            } else {
                log(chalk.blue('(' + columnItem.fieldName + ') KEEP columnName ' + columnItem.newColumnName));
            }

            // TODO entity generator uses fieldNameAsDatabaseColumn and not props.columnName anymore, we don't dispose of the former thou.
            jhipsterFunc.replaceContent(files.ORM, `@Column(name = "${columnItem.fieldNameUnderscored}`, `@Column(name = "${columnItem.newColumnName}`);
            jhipsterFunc.replaceContent(files.liquibase, `<column name="${columnItem.fieldNameUnderscored}`, `<column name="${columnItem.newColumnName}`);
        });
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
