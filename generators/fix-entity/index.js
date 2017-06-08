const generator = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('./prompts.js');
const fs = require('fs');

const dbh = require('../dbh.js');

// Stores JHipster variables
const jhipsterVar = {
    moduleName: 'fix-entity'
};

// Stores JHipster functions
const jhipsterFunc = {};


module.exports = generator.extend({
    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);

        // Option used to make unit tests in temporary directories instead of the current directory.
        // The passed string argument references constants,
        // those constants can be found in test/test-constants.js.
        this.option('dbhTestCase', {
            desc: 'Test case for this module\'s npm test',
            type: String,
            defaults: ''
        });

        this.dbhTestCase = this.options.dbhTestCase;

        // All information from entity generator
        this.entityConfig = this.options.entityConfig;
        this.entityTableName = this.options.entityConfig.entityTableName;
        this.entityClass = this.options.entityConfig.entityClass;
        this.dbhIdName = this.options.entityConfig.data.dbhIdName;
        this.fields = this.options.entityConfig.data.fields;
        this.relationships = this.options.entityConfig.data.relationships;
        this.force = this.options.force;

        if (this.force && !this.dbhIdName) {
            throw new Error('You\'ve used option "--force" with an invalid configuration file, fix-entity stops his execution');
        }

        if (this.force) {
            // use value from configuration file, don't get input from user
            this.tableNameInput = this.entityTableName;
            this.idNameInput = this.dbhIdName;
            this.columnsInput = this.fields;
        } else {
            // input from user (prompts.js will fill them)
            this.tableNameInput = null;
            this.idNameInput = null;
            this.columnsInput = [];
        }
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
    },

    // prompt the user for options
    prompting: {
        askForTableName: prompts.askForTableName,
        askForIdName: prompts.askForIdName,
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

        const filesArr = Object.keys(files);

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

        const replaceIdName = (paramFiles, newValue) => {
            jhipsterFunc.updateEntityConfig(paramFiles.config, 'dbhIdName', newValue);

            /**
             * - (@Column\\(.*\\))? is there to remove any previous @Column tag
             * - (\\s*) is there to catch the indentation
             * - (private Long id;) is the landmark we use to know where to insert the new @Column tag.
             */
            jhipsterFunc.replaceContent(paramFiles.ORM, '(@Column\\(.*\\))?(\\s*)(private Long id;)', `$2@Column(name = "${newValue}")$2$3`, true);
            /**
             * - (<column name=") A first pattern to match
             * - (id|${this.dbhIdName}) Either the litteral value id or the previous value set by this module
             * - (".*>\\s*<constraints primaryKey="true") A second pattern to match
             *   - " The closure of the name property
             *   - .*> The end of the column tag.
             *   - \\s* Any number of white spaces
             *   - <constraints primaryKey="true" The heart of the pattern we want to match, this makes sure we're at the right place
             */
            jhipsterFunc.replaceContent(paramFiles.liquibaseEntity, `(<column name=")(id|${this.dbhIdName})(".*>\\s*<constraints primaryKey="true")`, `$1${newValue}$3`, true);
        };

        // verify files exist
        filesArr.forEach((file) => {
            if (!fs.existsSync(files[file])) {
                throw new Error(`JHipster-db-helper : File not found (${file}: ${files[file]}).`);
            }
        });

        replaceTableName(files, this.tableNameInput);

        // Add/Change/Keep dbhIdName
        replaceIdName(files, this.idNameInput);

        // Add/Change/Keep dbhColumnName for each field
        this.columnsInput.forEach((columnItem) => {
            const oldValue = columnItem.dbhColumnName;
            const newValue = columnItem.columnNameInput || columnItem.dbhColumnName;

            updateKey(`"fieldName": "${columnItem.fieldName}"`, 'dbhColumnName', oldValue, newValue);

            // We search either for our value or JHipster value, so it works even if user didn't accept JHipster overwrite while regenerating
            jhipsterFunc.replaceContent(files.ORM, `@Column\\(name = "(${columnItem.fieldNameAsDatabaseColumn}|${oldValue})`, `@Column(name = "${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseEntity, `<column name="(${columnItem.fieldNameAsDatabaseColumn}|${oldValue})`, `<column name="${newValue}`, true);
        });

        /**
         * Lots of the relationships's values are guessed from the convention.
         * But as using this module means you don't respect the convention, these guesses won't be correct and we must guess the values ourselves.
         */
        // Add/Change/Keep dbhRelationshipId
        this.relationships.forEach((relationshipItem) => {
            // We don't need to do anything about relationships which don't add any constraint.
            if (relationshipItem.relationshipType === 'one-to-many' ||
                (relationshipItem.relationshipType === 'one-to-one' && !relationshipItem.ownerSide) ||
                (relationshipItem.relationshipType === 'many-to-many' && !relationshipItem.ownerSide)) {
                return;
            }

            const otherEntity = JSON.parse(fs.readFileSync(`${this.entityConfig.jhipsterConfigDirectory}/${relationshipItem.otherEntityNameCapitalized}.json`, 'utf8'));
            const oldValue = relationshipItem.dbhRelationshipId;

            let columnName = null;
            let newValue = null;
            let initialTableIdName = null;


            if (relationshipItem.relationshipType === 'many-to-one' || (relationshipItem.relationshipType === 'one-to-one' && relationshipItem.ownerSide)) {
                columnName = dbh.getColumnIdName(relationshipItem.relationshipName);
                newValue = `${relationshipItem.relationshipName}_id`;

                jhipsterFunc.replaceContent(files.liquibaseConstraints, `baseTableName="${this.entityTableName}`, `baseTableName="${this.tableNameInput}`);
                jhipsterFunc.replaceContent(files.liquibaseConstraints, `(referencedColumnNames=")id("\\s*referencedTableName="${otherEntity.entityTableName}")`, `$1${otherEntity.dbhIdName}$2`, true);

                if (relationshipItem.relationshipType === 'many-to-one') {
                    /**
                     * (@JoinColumn.*\\))? any previous is deleted if existing
                     * (\\s*) catch indentation
                     * (private ${relationshipItem.otherEntityNameCapitalized} ${relationshipItem.relationshipName};) landmark used to find the correct place
                     */
                    jhipsterFunc.replaceContent(files.ORM, `(@JoinColumn.*\\))?(\\s*)(private ${relationshipItem.otherEntityNameCapitalized} ${relationshipItem.relationshipName};)`, `$2@JoinColumn(name = "${newValue}")$2$3`, true);
                } else {
                    jhipsterFunc.replaceContent(files.ORM, `(@JoinColumn.*)(\\)\\s*private ${relationshipItem.otherEntityNameCapitalized} ${relationshipItem.relationshipName};)`, `$1, name = "${newValue}"$2`, true);
                }
            } else if (relationshipItem.relationshipType === 'many-to-many' && relationshipItem.ownerSide) {
                columnName = dbh.getPluralColumnIdName(relationshipItem.relationshipName);
                newValue = `${relationshipItem.relationshipNamePlural}_id`;
                initialTableIdName = dbh.getPluralColumnIdName(this.entityClass);

                jhipsterFunc.replaceContent(files.liquibaseEntity, `<addPrimaryKey columnNames="${initialTableIdName}, (${columnName}|${oldValue})`, `<addPrimaryKey columnNames="${initialTableIdName}, ${newValue}`, true);
                jhipsterFunc.replaceContent(files.liquibaseConstraints, `referencedTableName="${this.entityTableName}`, `referencedTableName="${this.tableNameInput}`);
                jhipsterFunc.replaceContent(files.ORM, `inverseJoinColumns = @JoinColumn\\(name="(${columnName}|${oldValue})`, `inverseJoinColumns = @JoinColumn(name="${newValue}`, true);
                jhipsterFunc.replaceContent(files.liquibaseConstraints, `(referencedColumnNames=")id("\\s*referencedTableName="${this.entityTableName}")`, `$1${this.idNameInput}$2`, true);
                // todo duplicate line, will remove on refactoring (duplicate with l258 as of the commit bringing this up)
                jhipsterFunc.replaceContent(files.liquibaseConstraints, `(referencedColumnNames=")id("\\s*referencedTableName="${otherEntity.entityTableName}")`, `$1${otherEntity.dbhIdName}$2`, true);
                jhipsterFunc.replaceContent(files.ORM, `(@JoinColumn\\(name="${initialTableIdName}", referencedColumnName=")id`, `$1${this.idNameInput}`, true);
                jhipsterFunc.replaceContent(files.ORM, `(inverseJoinColumns = @JoinColumn\\(name="${newValue}", referencedColumnName=")id`, `$1${otherEntity.dbhIdName}`, true);
            }

            updateKey(`"relationshipName": "${relationshipItem.relationshipName}"`, 'dbhRelationshipId', oldValue, newValue);

            jhipsterFunc.replaceContent(files.liquibaseEntity, `<column name="(${columnName}|${oldValue})`, `<column name="${newValue}`, true);
            jhipsterFunc.replaceContent(files.liquibaseConstraints, `<addForeignKeyConstraint baseColumnNames="(${columnName}|${oldValue})`, `<addForeignKeyConstraint baseColumnNames="${newValue}`, true);

            // The annotation @JsonProperty needs this additional import
            const newImport = 'import com.fasterxml.jackson.annotation.JsonProperty;';
            const landmarkImport = 'import org.hibernate.annotations.Cache;';
            jhipsterFunc.replaceContent(files.ORM, `(${newImport})?\n${landmarkImport}`, `${newImport}\n${landmarkImport}`, true);
            const oldAddition = '@JsonProperty\\(".*"\\)';
            const addition = `@JsonProperty("${relationshipItem.otherEntityNameCapitalized}")`;
            const landmark = `public ${relationshipItem.otherEntityNameCapitalized} get${relationshipItem.otherEntityNameCapitalized}`;
            /**
             * (${oldAddition}\\s*)? - $1 : remove a possibly present old annotation
             * (\\n( |\\t)*) - $2 : catch the indentation
             */
            jhipsterFunc.replaceContent(files.ORM, `(${oldAddition}\\s*)?(\\n( |\\t)*)${landmark}`, `$2${addition}$2${landmark}`, true);
        });
    },

    // cleanup, say goodbye
    end() {
        this.log(chalk.bold.yellow('End of fix-entity generator'));
    }
});
