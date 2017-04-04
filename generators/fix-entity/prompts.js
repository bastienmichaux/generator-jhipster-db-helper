const chalk = require('chalk');
const generator = require('yeoman-generator');


module.exports = {
    askForTableName,
    askForColumnName
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

function askForColumnName() {
    const done = this.async();
    this.prompt({
        type: 'input',
        name: 'askForColumnName',
        validate: (input) => {
            return true;
        },
        message: 'What is the column name for this field?',
        default: 'My column name'
    }).then((prompt) => {
        this.log('askForColumnName : then');
        done();
    });
}

