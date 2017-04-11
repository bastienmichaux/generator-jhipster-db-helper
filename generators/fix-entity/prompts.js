const chalk = require('chalk');
const generator = require('yeoman-generator');


module.exports = {
    askForTableName,
    askForColumnsName
};

/**
 * Ask the table name for an entity
 * @todo: add rules to the validate method
 */
function askForTableName() {
    const done = this.async();
    this.prompt([
        {
            type: 'input',
            name: 'tableName',
            validate: input => {
                if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                    return 'The table name cannot contain special characters';
                } else if (input === '') {
                    return 'The table name cannot be empty';
                } else if (this.prodDatabaseType === 'oracle' && input.length > 14) {
                    return 'The table name is too long for Oracle, try a shorter name';
                } else if (input.length > 30) {
                    return 'The table name is too long, try a shorter name';
                }
                return true;
            },
            message: 'What is the table name for this entity?',
            default: this.defaultTableName
        }
    ]).then((props) => {
        this.tableNameInput = props.tableName;
        done();
    });
}

/** For each field of an entity, ask the actual column name */
function askForColumnsName() {
    // Don't ask columns name if there aren't any field
    if (this.fields === undefined || this.fields.length === 0) {
        return;
    }

    this.log(chalk.green(`Asking column names for ${this.fields.length} field(s)`));
    const done = this.async();

    // work on a copy
    this.fieldsPile = this.fields.slice();
    // feed the first item for the first question
    this.field = this.fieldsPile.pop();
    askForColumnName.call(this, done);
}

/**
 * Ask the column name for the field of an entity
 * @todo: add rules to the validate method
 **/
function askForColumnName(done) {
    let messageAddendum = '';
    let defaultValue = '';

    if (this.field.columnName !== undefined) {
        messageAddendum = `(currently : ${this.field.columnName})`;
        defaultValue = this.field.columnName;
    } else {
        messageAddendum = '';
        defaultValue = this.field.fieldName;
    }

    const prompts = [
        {
            type: 'input',
            name: 'columnName',
            validate: input => {
                if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                    return 'Your column name cannot contain special characters';
                } else if (input === '') {
                    return 'Your column name cannot be empty';
                } else if (this.prodDatabaseType === 'oracle' && input.length > 30) {
                    return 'The column name cannot be of more than 30 characters';
                }
                return true;
            },
            message: `What column name do you want for field "${this.field.fieldName}" ? ${messageAddendum}`,
            default: defaultValue
        }
    ];

    this.prompt(prompts).then((props) => {
        this.field.newColumnName = props.columnName;

        this.columnsInput.push(this.field);
        this.field = this.fieldsPile.pop();

        if (this.field !== undefined) {
            askForColumnName.call(this, done);
        } else {
            done();
        }
    });
}

