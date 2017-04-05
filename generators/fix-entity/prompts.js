const chalk = require('chalk');
const generator = require('yeoman-generator');


module.exports = {
    askForTableName,
    askForColumnsName
};

function askForTableName() {
    const done = this.async();
    this.prompt({
        type: 'input',
        name: 'tableName',
        validate: (input) => {
            return true;
        },
        message: 'What is the table name for this entity?',
        default: this.defaultTableName
    }).then((props) => {
        this.tableNameInput = props.tableName;
        done();
    });
}

function askForColumnsName() {
    const done = this.async();
    const prompt = [
        {
            type: 'input',
            name: 'columnName',
            validate: (input) => {
                return true;
            },
            message: 'What is the column name for this field?',
            default: 'My column name'
        }
    ];
    this.prompt(prompt).then((props) => {
        this.columnsInput.push(props.columnName);
        done();
    });
}

