const chalk = require('chalk');
const generator = require('yeoman-generator');


module.exports = {
    askForTableName,
    askForColumnName
};

function askForTableName () {
    const done = this.async();
    this.prompt({
        type: 'input',
        name: 'askForTableName',
        validate: (input) => {
            return true;
        },
        message: 'What is the table name for this entity?',
        default: 'My table name'
    }).then((prompt) => {
        this.log('askForTableName : then');
        done();
    });
}

function askForColumnName () {
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

