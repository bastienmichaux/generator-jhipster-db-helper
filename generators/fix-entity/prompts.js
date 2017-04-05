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
    this.field = this.fieldsPile.pop(); // TODO this is not DRY (see askForColumnsName)
    askForColumnName.call(this, done);
}

function askForColumnName(done) {
    const prompts = [
        {
            type: 'input',
            name: 'columnName',
            validate: (input) => {
                return true;
            },
            message: 'What column name do you want for field "' + this.field.fieldName + '" ?',
            default: this.field.fieldName
        }
    ];

    this.prompt(prompts).then((props) => {
        const columnMap = {
            fieldName: this.field.fieldName,
            columnName: props.columnName
        };

        this.columnsInput.push(columnMap);

        this.field = this.fieldsPile.pop(); // TODO this is not DRY (see askForColumnsName)
        if(this.field !== undefined) {
            askForColumnName.call(this, done);
        } else {
            done();
        }
    });
}

