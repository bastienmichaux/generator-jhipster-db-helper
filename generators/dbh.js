const DBH_CONSTANTS = require('./dbh-constants');
const fs = require('fs');
const jhipsterCore = require('jhipster-core');
const pluralize = require('pluralize');

/** a promise returning the current JHipster app config as a JSON object */
const getAppConfig = directory => new Promise((resolve, reject) => {
    // path to '.yo-rc.json'
    const path = directory + DBH_CONSTANTS.appConfigFile;

    // if file exists, return it as a JSON object
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(err));
            }
            const appConfigToJson = JSON.parse(data);

            // handle undefined object
            if (appConfigToJson) {
                resolve(appConfigToJson);
            } else {
                reject(new Error(`getAppConfig: no output. Type: ${typeof appConfigToJson}, value: ${appConfigToJson}`));
            }
        });
    } else {
        reject(new Error(`getAppConfig: file ${path} not found`));
    }
});


/** assert parameter is a non-empty string */
const isTrueString = x => typeof x === 'string' && x !== '';


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
 **/
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

/**
 * get hibernate SnakeCase in JHipster preferred style.
 *
 * @param {string} value - table column name or table name string
 * @see org.springframework.boot.orm.jpa.hibernate.SpringNamingStrategy
 */
const hibernateSnakeCase = (value) => {
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

const getColumnIdName = (name) => hibernateSnakeCase(name) + '_id';

const getPluralColumnIdName = (name) => getColumnIdName(pluralize(name));

/**
 * Check if these relationships add constraints.
 * Typically, an one-to-many relationship doesn't add a constraint to the entity on the one side.
 *
 * @param relationships an array of relationship to check
 * @returns {boolean}
 */
const hasConstraints = (relationships) => {
    for(let idx = 0; idx < relationships.length; idx++) {
        if(relationships[idx].relationshipType === 'many-to-one' || (relationships[idx].relationshipType === 'one-to-one' && relationships[idx].ownerSide)) {
            return true;
        }
        if(relationships[idx].relationshipType === 'many-to-many' && relationships[idx].ownerSide) {
            return true;
        }
    }

    return false;
};


module.exports = {
    getAppConfig,
    isTrueString,
    validateColumnName,
    validateTableName,
    getColumnIdName,
    getPluralColumnIdName,
    hasConstraints
};
