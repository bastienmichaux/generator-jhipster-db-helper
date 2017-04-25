const generator = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('./prompts.js');
const fs = require('fs');
const dbh = require('../dbh.js');


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
        this.dbhTableName = this.options.entityConfig.data.dbhTableName;
        this.fields = this.options.entityConfig.data.fields;
        this.relationships = this.options.entityConfig.data.relationships;

        // input from user (prompts.js will fill them)
        this.tableNameInput = null;
        this.columnsInput = [];
    },


    // check current project state, get configs, etc
    initializing() {
        this.log(chalk.bold.bgYellow('fix-entity generator'));
        this.log(chalk.bold.yellow('initializing'));

        this.composeWith('jhipster:modules',
            { jhipsterVar, jhipsterFunc },
            this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
        );
        this.appConfig = jhipsterVar.jhipsterConfig;

        /* / TODO remove on prod
        this.prodDatabaseType = jhipsterVar.prodDatabaseType;
        this.log(chalk.blue('<<<<<BEFORE'));
        this.log(chalk.blue('entityConfig'));
        this.log(this.entityConfig);
        this.log(chalk.blue('fields'));
        this.log(this.fields);
        this.log(chalk.blue('relations'));
        this.log(this.options.entityConfig.data.relationships);
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
        /**
         * Return path to the liquibase file corresponding to this entity and type of file.
         *
         * @param type is either 'entity' or 'entity_constraints'
         */
        const getLiquibaseFile = type => `${jhipsterVar.resourceDir}config/liquibase/changelog/${this.entityConfig.data.changelogDate}_added_${type}_${this.entityConfig.entityClass}.xml`;

        const files = {
            config: this.entityConfig.filename,
            ORM: `${jhipsterVar.javaDir}domain/${this.entityConfig.entityClass}.java`,
            liquibaseEntity: getLiquibaseFile('entity')
        };

        if (dbh.hasConstraints(this.relationships)) {
            files.liquibaseConstraints = getLiquibaseFile('entity_constraints');
        }

        // todo it would be nice to move this procedure to dbh.js but it will loose access to jhipsterFunc
        /**
         * Update the value associated with the key. If the key doesn't exist yet, creates it.
         * To do so it checks the oldValue, undefined will be understood as if the key doesn't exist.
         *
         * @param landmark the value beneath which it will add the key if not existent
         * @param key the one it operates on
         * @param oldValue the value associated to the key before the execution of this procedure (can be undefined)
         * @param newValue the value to associate to the key, replace oldValue if any
         */
        const updateKey = (landmark, key, oldValue, newValue) => {
            if (oldValue === undefined) {
                // '(\\s*)' is for capturing indentation
                jhipsterFunc.replaceContent(files.config, `(\\s*)${landmark}`, `$1${landmark},$1"${key}": "${newValue}"`, true);
            } else {
                jhipsterFunc.replaceContent(files.config, `"${key}": "${oldValue}`, `"${key}": "${newValue}`);
            }
        };

        // Add/Change/Keep dbhTableName
        const replaceTableName = (paramFiles) => {
            const oldValue = this.dbhTableName;
            const newValue = this.tableNameInput;

            updateKey(`"entityTableName": "${this.entityTableName}"`, 'dbhTableName', oldValue, newValue);

            // We search either for our value or jhipster value, so it works even if user didn't accept JHipster overwrite after a regeneration
            jhipsterFunc.replaceContent(paramFiles.ORM, `@Table\\(name = "(${this.entityTableName}|${oldValue})`, `@Table(name = "${newValue}`, true);
            jhipsterFunc.replaceContent(paramFiles.liquibaseEntity, `\\<createTable tableName="(${this.entityTableName}|${oldValue})`, `<createTable tableName="${newValue}`, true);
        };

        // DEBUG : log where we are
        this.log(chalk.bold.yellow('writing'));

        // verify files exist
        for (const file in files) {
            // hasOwnProperty to avoid inherited properties
            if (files.hasOwnProperty(file) && !fs.existsSync(files[file])) {
                throw new Error(`JHipster-db-helper : File not found (${file}: ${files[file]}).`);
            }
        }

        replaceTableName(files);

        // Add/Change/Keep dbhColumnName for each field
        this.columnsInput.forEach((columnItem) => {
            const oldValue = columnItem.dbhColumnName;
            const newValue = columnItem.columnNameInput;

            updateKey(`"fieldName": "${columnItem.fieldName}"`, 'dbhColumnName', oldValue, newValue);

            // We search either for our value or JHipster value, so it works even if user didn't accept JHipster overwrite while regenerating
            jhipsterFunc.replaceContent(files.ORM, `@Column\\(name = "(${columnItem.fieldNameAsDatabaseColumn}|${oldValue})`, `@Column(name = "${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<column name="(${columnItem.fieldNameAsDatabaseColumn}|${oldValue})`, `<column name="${newValue}`, true);
        });

        // Add/Change/Keep dbhRelationshipId
        this.relationships.forEach((relationshipItem) => {
            const oldValue = relationshipItem.dbhRelationshipId;

            let columnName = null;
            let newValue = null;

            if (relationshipItem.relationshipType === 'many-to-one' || (relationshipItem.relationshipType === 'one-to-one' && relationshipItem.ownerSide)) {
                columnName = dbh.getColumnIdName(relationshipItem.relationshipName);
                newValue = `${relationshipItem.relationshipName}_id`;
            } else if (relationshipItem.relationshipType === 'many-to-many' && relationshipItem.ownerSide) {
                columnName = dbh.getPluralColumnIdName(relationshipItem.relationshipName);
                newValue = `${relationshipItem.relationshipNamePlural}_id`;

                jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<addPrimaryKey columnNames="${dbh.getPluralColumnIdName(this.entityTableName)}, (${columnName}|${oldValue})`, `<addPrimaryKey columnNames="${dbh.getPluralColumnIdName(this.entityTableName)}, ${newValue}`, true);
                jhipsterFunc.replaceContent(files.ORM, `inverseJoinColumns = @JoinColumn\\(name="(${columnName}|${oldValue})`, `inverseJoinColumns = @JoinColumn(name="${newValue}`, true);
            } else {
                // We don't need to do anything about relationship which don't add any constraint.
                return;
            }

            updateKey(`"relationshipName": "${relationshipItem.relationshipName}"`, 'dbhRelationshipId', oldValue, newValue);

            jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<column name="(${columnName}|${oldValue})`, `<column name="${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseConstraints, `\\<addForeignKeyConstraint baseColumnNames="(${columnName}|${oldValue})`, `<addForeignKeyConstraint baseColumnNames="${newValue}`, true);
        });
    },


    // conflict() : Where conflicts are handled (used internally)

    // run installation (npm, bower, etc)
    install() {
        this.log(chalk.bold.yellow('install'));
    },


    // cleanup, say goodbye
    end() {
        this.log(chalk.bold.yellow('End of fix-entity generator'));
    }
});
