const generator = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('./prompts.js');
const fs = require('fs');

const jhipsterConstants = require('../../node_modules/generator-jhipster/generators/generator-constants.js');
const jhipsterModuleSubgenerator = require('../../node_modules/generator-jhipster/generators/modules/index.js');
const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants.js');

// Stores JHipster variables
const jhipsterVar = {
    moduleName: DBH_CONSTANTS.fixEntityModuleName
};

// Stores JHipster functions
const jhipsterFunc = {};

// polyfill for jhipsterVar and jhipsterFunc when testing, see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19)
let polyfill = {};

module.exports = generator.extend({
    // dummy test
    _sayFoo: () => 'foo',

    /**
     * get a polyfill for the jhipsterVar and jhipsterFunc properties gone missing when testing
     * because of a [yeoman-test](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19) issue
     *
     * @param {string} appConfigPath - path to the current .yo-rc.json application file
     */
    _getPolyfill: (appConfigPath) => {
        // stop if file not found
        if (!fs.existsSync(appConfigPath)) {
            throw new Error(`_getPolyfill: File ${appConfigPath} not found`);
        }

        // else return a promise holding the polyfill
        return dbh.getAppConfig(appConfigPath)
        .catch(err => console.error(err))
        .then((onResolve) => {
            const conf = onResolve['generator-jhipster'];
            const poly = {};

            // @todo: defensive programming with these properties (hasOwnProperty ? throw ?)

            // jhipsterVar polyfill :

            poly.jhipsterConfig = conf;
            poly.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + conf.packageFolder}/`;
            poly.resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
            poly.replaceContent = jhipsterModuleSubgenerator.prototype.replaceContent;
            poly.updateEntityConfig = jhipsterModuleSubgenerator.prototype.updateEntityConfig;

            // @todo : handle this.options.testMode ?

            return poly;
        }, onError => console.error(onError));
    },

    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);
        // All information from entity generator
        this.entityConfig = this.options.entityConfig;
        this.entityTableName = this.options.entityConfig.entityTableName;
        this.fields = this.options.entityConfig.data.fields;
        this.relationships = this.options.entityConfig.data.relationships;
        this.force = this.options.force;

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

        // @todo it would be nice to move this procedure to dbh.js but it will loose access to jhipsterFunc
        /**
         * Update the value associated with the key. If the key doesn't exist yet, creates it.
         * To do so it checks the oldValue, undefined will be understood as if the key doesn't exist.
         *
         * @param landmark - the value beneath which it will add the key is not existent
         * @param key - the one it operates on
         * @param oldValue - the value associated to the key before the execution of this procedure (can be undefined)
         * @param newValue - the value to associate to the key, replace oldValue if any
         */
        const updateKey = (landmark, key, oldValue, newValue) => {
            if (oldValue === undefined) {
                // '(\\s*)' is for capturing indentation
                jhipsterFunc.replaceContent(files.config, `(\\s*)${landmark}`, `$1${landmark},$1"${key}": "${newValue}"`, true);
            } else {
                jhipsterFunc.replaceContent(files.config, `"${key}": "${oldValue}`, `"${key}": "${newValue}`);
            }
        };

        const replaceTableName = (paramFiles, newValue) => {
            jhipsterFunc.updateEntityConfig(paramFiles.config, 'entityTableName', newValue);

            // We search either for our value or jhipster value, so it works even if user didn't accept JHipster overwrite after a regeneration
            jhipsterFunc.replaceContent(paramFiles.ORM, `@Table(name = "${this.entityTableName}`, `@Table(name = "${newValue}`);
            jhipsterFunc.replaceContent(paramFiles.liquibaseEntity, `<createTable tableName="${this.entityTableName}`, `<createTable tableName="${newValue}`);
        };

        this.log(chalk.bold.yellow('writing'));

        // verify files exist
        for (const file in files) {
            // hasOwnProperty to avoid inherited properties
            if (files.hasOwnProperty(file) && !fs.existsSync(files[file])) {
                throw new Error(`JHipster-db-helper : File not found (${file}: ${files[file]}).`);
            }
        }

        /* // refactoring for later
        // verify files exist
        const filesArr = Object.keys(files);
        filesArr.forEach((file) => {
            if (!fs.existsSync(files[file])) {
                throw new Error(`JHipster-db-helper : File not found (${file}: ${files[file]}).`);
            }
        });
        */
        if(this.force) {
            this.tableNameInput = this.entityTableName;
            this.columnsInput = this.fields;
        }

        replaceTableName(files, this.tableNameInput);

        // Add/Change/Keep dbhColumnName for each field
        this.columnsInput.forEach((columnItem) => {
            const oldValue = columnItem.dbhColumnName;
            if(!oldValue && this.force) {
                throw new Error('You used option --force with bad configuration file, it needs dbhColumnName for each field');
            }
            const newValue = columnItem.columnNameInput || columnItem.dbhColumnName;

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

                jhipsterFunc.replaceContent(files.liquibaseConstraints, `baseTableName="${this.entityTableName}`, `baseTableName="${this.tableNameInput}`);
            } else if (relationshipItem.relationshipType === 'many-to-many' && relationshipItem.ownerSide) {
                columnName = dbh.getPluralColumnIdName(relationshipItem.relationshipName);
                newValue = `${relationshipItem.relationshipNamePlural}_id`;

                jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<addPrimaryKey columnNames="${dbh.getPluralColumnIdName(this.entityTableName)}, (${columnName}|${oldValue})`, `<addPrimaryKey columnNames="${dbh.getPluralColumnIdName(this.entityTableName)}, ${newValue}`, true);
                jhipsterFunc.replaceContent(files.liquibaseConstraints, `referencedTableName="${this.entityTableName}`, `referencedTableName="${this.tableNameInput}`);
                jhipsterFunc.replaceContent(files.ORM, `inverseJoinColumns = @JoinColumn\\(name="(${columnName}|${oldValue})`, `inverseJoinColumns = @JoinColumn(name="${newValue}`, true);
            } else {
                // We don't need to do anything about relationships which don't add any constraint.
                return;
            }

            updateKey(`"relationshipName": "${relationshipItem.relationshipName}"`, 'dbhRelationshipId', oldValue, newValue);

            jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<column name="(${columnName}|${oldValue})`, `<column name="${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseConstraints, `\\<addForeignKeyConstraint baseColumnNames="(${columnName}|${oldValue})`, `<addForeignKeyConstraint baseColumnNames="${newValue}`, true);
        });
    },

    // run installation (npm, bower, etc)
    install() {
        this.log(chalk.bold.yellow('install'));
    },


    // cleanup, say goodbye
    end() {
        this.log(chalk.bold.yellow('End of fix-entity generator'));
    }
});
