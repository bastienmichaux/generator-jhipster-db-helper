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
            validate: input => true,
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

    this.log(chalk.green(`Asking column names for ${this.fields.length} fields`));
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

	// TODO check if the column field has already been added to this.fields
	// TODO display current field AND if present column name when asking for a new column name
	// TODO set default as column name value
    const prompts = [
        {
            type: 'input',
            name: 'columnName',
            validate: input => true,
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

