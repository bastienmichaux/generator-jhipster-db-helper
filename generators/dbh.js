const DBH_CONSTANTS = require('./dbh-constants');
const jhipsterCore = require('jhipster-core');
const pluralize = require('pluralize');


/**
 * assert parameter is a non-empty string
 * @todo Now unused, consider removal
 */
const isTrueString = x => typeof x === 'string' && x !== '';


const getColumnIdName = name => `${hibernateSnakeCase(name)}_id`;


const getPluralColumnIdName = name => getColumnIdName(pluralize(name));


/**
 * from the JHipster files where the original Spring naming strategies can be found,
 * remove the files that don't exist, depending on the current application build tool (Maven or Gradle)
 * if the app uses Maven, remove the Gradle file(s)
 * if the app uses Gradle, remove the Maven file(s)
 * the returned array holds only the existing files
 */
const getFilesWithNamingStrategy = (buildTool) => {
    // fail when application build tool is unknown
    if (buildTool !== 'maven' && buildTool !== 'gradle') {
        throw new Error(`build tool '${buildTool}' unknown`);
    }

    // utilities used to filter the files with naming strategy
    // TODO: no hardcoded values
    const removeGradleFiles = (item) => item !== './gradle/liquibase.gradle';
    const removeMavenFiles = (item) => item !== './pom.xml';

    const files = DBH_CONSTANTS.filesWithNamingStrategy.filter(buildTool === 'maven' ? removeGradleFiles : removeMavenFiles);

    return files;
};


/**
 * get hibernate SnakeCase in JHipster preferred style.
 *
 * @param {string} value - table column name or table name string
 * @see org.springframework.boot.orm.jpa.hibernate.SpringNamingStrategy
 */
const hibernateSnakeCase = value => {
    let res = '';
    if (value) {
        value = value.replace('.', '_');
        res = value[0];
        for (let i = 1, len = value.length - 1; i < len; i++) {
            if (value[i - 1] !== value[i - 1].toUpperCase() &&
                value[i] !== value[i].toLowerCase() &&
                value[i + 1] !== value[i + 1].toUpperCase()
            ) {
                res += `_${value[i]}`;
            } else {
                res += value[i];
            }
        }
        res += value[value.length - 1];
        res = res.toLowerCase();
    }
    return res;
};


/**
 * Check if these relationships add constraints.
 * Typically, an one-to-many relationship doesn't add a constraint to the entity on the one side.
 *
 * @param relationships an array of relationship to check
 * @returns {boolean}
 */
const hasConstraints = relationships => {
    for (let idx = 0; idx < relationships.length; idx++) {
        if (relationships[idx].relationshipType === 'many-to-one' || (relationships[idx].relationshipType === 'one-to-one' && relationships[idx].ownerSide)) {
            return true;
        }
        if (relationships[idx].relationshipType === 'many-to-many' && relationships[idx].ownerSide) {
            return true;
        }
    }

    return false;
};


/** Validate user input when asking for a SQL column name */
const validateColumnName = (input, dbType) => {
    if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
        return 'Your column name cannot contain special characters';
    } else if (input === '') {
        return 'Your column name cannot be empty';
    } else if (dbType === 'oracle' && input.length > 26) {
        return 'Your column name is too long for Oracle, try a shorter name';
    }
    return true;
};


/**
 * Validate user input when asking for a SQL table name
 * This function closely follows JHipster's own validateTableName function
 * (in generator-jhipster/generators/entity/index.js)
 */
const validateTableName = (input, dbType) => {
    if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
        return 'The table name cannot contain special characters';
    } else if (input === '') {
        return 'The table name cannot be empty';
    } else if (dbType === 'oracle' && input.length > 26) {
        return 'The table name is too long for Oracle, try a shorter name';
    } else if (dbType === 'oracle' && input.length > 14) {
        return 'The table name is long for Oracle, long table names can cause issues when used to create constraint names and join table names';
    } else if (jhipsterCore.isReservedTableName(input, dbType)) {
        return `'${input}' is a ${dbType} reserved keyword.`;
    }
    return true;
};


module.exports = {
    getColumnIdName,
    getFilesWithNamingStrategy,
    getPluralColumnIdName,
    hasConstraints,
    isTrueString,
    validateColumnName,
    validateTableName
};
