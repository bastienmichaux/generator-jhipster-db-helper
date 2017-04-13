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
        // All information from entity generator
        this.entityConfig = this.options.entityConfig;
        this.entityTableName = this.options.entityConfig.entityTableName;
        this.tableNameDBH = this.options.entityConfig.data.tableNameDBH;
        this.fields = this.options.entityConfig.data.fields;

        // input from user (prompts.js will fill them)
        this.tableNameInput = null;
        this.columnsInput = [];
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
        this.prodDatabaseType = jhipsterVar.prodDatabaseType;
        this.log(chalk.blue('<<<<<BEFORE'));
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
        this.log(chalk.bold.yellow('writing'));

        const files = {
            config: this.entityConfig.filename,
            ORM: `${jhipsterVar.javaDir}/domain/${this.entityConfig.entityClass}.java`,
            liquibase: `${jhipsterVar.resourceDir}config/liquibase/changelog/${this.entityConfig.data.changelogDate}_added_entity_${this.entityConfig.entityClass}.xml`
        };

        for (let file in files) {
            // hasOwnProperty to avoid inherited properties
            if (files.hasOwnProperty(file) && !fs.existsSync(files[file])) {
                throw new Error('JHipster-db-helper : File not found (' + file + ': ' + files[file] + ').');
            }
        }

        // Add/Change/Keep tableNameDBH
        {
            const pattern = `"entityTableName": "${this.entityTableName}"`;
            const key = 'tableNameDBH';
            const oldValue = this.tableNameDBH;
            const newValue = this.tableNameInput;

            if (oldValue === undefined) {
                // '(\\s*)' is for capturing indentation
                jhipsterFunc.replaceContent(files.config, `(\\s*)${pattern}`, `$1${pattern},$1"${key}": "${newValue}"`, true);
            } else {
                jhipsterFunc.replaceContent(files.config, `"${key}": "${oldValue}`, `"${key}": "${newValue}`);
            }
            jhipsterFunc.replaceContent(files.ORM, `@Table(name = "${this.entityTableName}`, `@Table(name = "${newValue}`);
            jhipsterFunc.replaceContent(files.liquibase, `<createTable tableName="${this.entityTableName}`, `<createTable tableName="${newValue}`);
        }

        // Add/Change/Keep columnNameDBH for each field
        this.columnsInput.forEach((columnItem) => {
            const pattern = `"fieldName": "${columnItem.fieldName}"`;
            const key = 'columnNameDBH';
            const oldValue = columnItem.columnNameDBH;
            const newValue = columnItem.columnNameInput;

            if (oldValue === undefined) {
                // '(\\s*)' is for capturing indentation
                jhipsterFunc.replaceContent(files.config, `(\\s*)${pattern}`, `$1${pattern},$1"${key}": "${newValue}"`, true);
            } else {
                jhipsterFunc.replaceContent(files.config, `"${key}": "${oldValue}`, `"${key}": "${newValue}`);
            }

            // TODO entity generator uses fieldNameAsDatabaseColumn and not fieldNameUnderscored anymore, we don't dispose of the former thou.
            jhipsterFunc.replaceContent(files.ORM, `@Column(name = "${columnItem.fieldNameUnderscored}`, `@Column(name = "${newValue}`);
            jhipsterFunc.replaceContent(files.liquibase, `<column name="${columnItem.fieldNameUnderscored}`, `<column name="${newValue}`);
        });
    },


    // conflict() : Where conflicts are handled (used internally)

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this.log(chalk.bold.yellow('install'));
    },


    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this.log(chalk.bold.yellow('End of fix-entity generator'));
    }
});
