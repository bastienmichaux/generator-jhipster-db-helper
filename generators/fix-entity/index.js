const chalk = require('chalk');
const fs = require('fs');
const generator = require('yeoman-generator');

const dbh = require('../dbh.js');
const DBH_CONSTANTS = require('../dbh-constants.js');
const jhipsterConstants = require('../../node_modules/generator-jhipster/generators/generator-constants.js');
const jhipsterModuleSubgenerator = require('../../node_modules/generator-jhipster/generators/modules/index.js');
const prompts = require('./prompts.js');

// Stores JHipster variables
const jhipsterVar = {
    moduleName: DBH_CONSTANTS.fixEntityModuleName
};

// Stores JHipster functions
const jhipsterFunc = {};

// polyfill for jhipsterVar and jhipsterFunc
let polyfill = {};

module.exports = generator.extend({
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
        .catch(err => new Error(err))
        .then((onResolve) => {
            const conf = onResolve['generator-jhipster'];
            const poly = {};

            // @todo: defensive programming with these properties (hasOwnProperty ? throw ?)

            // jhipsterVar and jhipsterFunc polyfill :
            poly.jhipsterConfig = conf;
            poly.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + conf.packageFolder}/`;
            poly.resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
            poly.replaceContent = jhipsterModuleSubgenerator.prototype.replaceContent;
            poly.updateEntityConfig = jhipsterModuleSubgenerator.prototype.updateEntityConfig;

            // @todo : handle this.options.testMode ?

            return poly;
        }, onError => new Error(onError));
    },

    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);
        // All information from entity generator
        this.entityConfig = this.options.entityConfig;
        this.entityTableName = this.options.entityConfig.entityTableName;
        this.fields = this.options.entityConfig.data.fields;
        this.relationships = this.options.entityConfig.data.relationships;
        this.force = this.options.force;

        // user input (prompts.js will fill them)
        this.tableNameInput = null;
        this.columnsInput = [];
    },

    // check current project state, get configs, etc
    initializing() {
        this.log(chalk.bold.bgYellow('fix-entity generator'));
        this.log(chalk.bold.yellow('initializing'));

        this.composeWith(
            'jhipster:modules',
            {jhipsterVar, jhipsterFunc},
            this.options.testmode
            ? {local: require.resolve('generator-jhipster/generators/modules')}
            : null
        );
        this.appConfig = jhipsterVar.jhipsterConfig;

        // replace missing properties for testing
        // for the reason why we have to do this, see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19)
        const configFile = path.join(__dirname, '/.yo-rc.json');

        if (!fs.existsSync(configFile)) {
            throw new Error(`This file doesn't exist: ${configFile}`);
        }

        polyfill = this._getPolyfill(configFile)
        .then(
            onFulfilled => {
                return onFulfilled;
            },
            onRejected => {
                return onRejected;
            }
        );
        Object.freeze(polyfill);
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

        /** replace the table names in the JHipster entity json files */
        const replaceTableName = (paramFiles) => {
            const newValue = this.tableNameInput || this.entityTableName;

            jhipsterFunc.updateEntityConfig(paramFiles.config, 'entityTableName', newValue);

            // We search either for our value or jhipster value, so it works even if user didn't accept JHipster overwrite after a regeneration
            jhipsterFunc.replaceContent(paramFiles.ORM, `@Table(name = "${this.entityTableName}`, `@Table(name = "${newValue}`);
            jhipsterFunc.replaceContent(paramFiles.liquibaseEntity, `<createTable tableName="${this.entityTableName}`, `<createTable tableName="${newValue}`);
        };

        // @todo it would be nice to move this procedure to dbh.js but it will loose access to jhipsterFunc
        /**
         * Update the value associated with the key. If the key doesn't exist yet, creates it.
         * To do so it checks the oldValue, undefined will be understood as if the key doesn't exist.
         *
         * @param landmark - the value beneath which it will add the key if not existent
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

        // TODO: freeze object (safely)
        const files = {
            config: this.entityConfig.filename,
            ORM: `${jhipsterVar.javaDir}domain/${this.entityConfig.entityClass}.java`,
            liquibaseEntity: getLiquibaseFile('entity'),
            liquibaseConstraints: ''
        };

        const filesArr = Object.keys(files);

        if (dbh.hasConstraints(this.relationships)) {
            files.liquibaseConstraints = getLiquibaseFile('entity_constraints');
        }

        // verify files exist
        filesArr.forEach((file) => {
            if (!fs.existsSync(files[file])) {
                throw new Error(`JHipster-db-helper : File not found (${file}: ${files[file]}).`);
            }
        });

        replaceTableName(files);

        // Add/Change/Keep dbhColumnName for each field
        if(this.force) {
            this.columnsInput = this.fields;
        }

        this.columnsInput.forEach((columnItem) => {
            const oldValue = columnItem.dbhColumnName;
            const newValue = columnItem.columnNameInput || columnItem.dbhColumnName;

            if(!oldValue && this.force) {
                throw new Error('You used option --force with bad configuration file, it needs dbhColumnName for each field');
            }

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
                // We don't need to do anything with the relationships if they don't add constraints.
                return;
            }

            updateKey(`"relationshipName": "${relationshipItem.relationshipName}"`, 'dbhRelationshipId', oldValue, newValue);

            jhipsterFunc.replaceContent(files.liquibaseEntity, `\\<column name="(${columnName}|${oldValue})`, `<column name="${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseConstraints, `\\<addForeignKeyConstraint baseColumnNames="(${columnName}|${oldValue})`, `<addForeignKeyConstraint baseColumnNames="${newValue}`, true);
        });
    },

    // cleanup, say goodbye
    end() {
        this.log(chalk.bold.yellow('End of fix-entity generator'));
    }
});
