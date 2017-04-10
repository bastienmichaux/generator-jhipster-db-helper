const chalk = require('chalk');
const generator = require('yeoman-generator');


module.exports = {
    askForTableName,
    askForColumnsName
};

function askForTableName() {
    const done = this.async();
    this.prompt([
        {
            type: 'input',
            name: 'tableName',
            validate: (input) => {
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

function askForColumnsName() {
    // Don't ask columns name if there aren't any field
    if(this.fields === undefined || this.fields.length === 0) {
        return;
    }

    this.log(chalk.green('Asking column names for ' + this.fields.length + ' fields'));
    const done = this.async();
    this.fieldsPile = this.fields.slice();
	this.field = this.fieldsPile.pop();
    askForColumnName.call(this, done);
}

function askForColumnName(done) {
    let messageAddentum, defaultValue;
    if(this.field.columnName !== undefined) {
        messageAddentum = '(currently : ' + this.field.columnName + ')';
        defaultValue = this.field.columnName;
    } else {
        messageAddentum = '';
        defaultValue = this.field.fieldName;
    }

	// TODO check if the column field has already been added to this.fields
	// TODO display current field AND if present column name when asking for a new column name
	// TODO set default as column name value
    const prompts = [
        {
            type: 'input',
            name: 'columnName',
            validate: (input) => {
                return true;
            },
            message: 'What column name do you want for field "' + this.field.fieldName + '" ? ' + messageAddentum,
            default: defaultValue
        }
    ];

    this.prompt(prompts).then((props) => {
        // We must add other values so we can add columnName to the correct field
        // If columnName was undefined, it means we must add it
        const columnItem = {
            fieldName: this.field.fieldName,
            oldColumnName: this.field.columnName,
            newColumnName: props.columnName
        };

        this.log(chalk.blue('PROMPT'));
        this.log(columnItem);
        this.log(props.columnName);

        this.columnsInput.push(columnItem);

        this.field = this.fieldsPile.pop();
        if(this.field !== undefined) {
            askForColumnName.call(this, done);
        } else {
            done();
        }
    });
}

