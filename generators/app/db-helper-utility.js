"use strict";

/**
 * TODOS : keep our TODOS here
 * - Write proper JsDoc
 * - Check constructs like 'console.log' versus 'this.log'
 */

// utility functions for generator-jhipster-db-helper

const chalk = require('chalk');
const generator = require('yeoman-generator');

module.exports = {

    // use this as a DEBUG logger
    debugLog : function (pString) {
        if (typeof pString === "string" && pString !== '') {
            console.log(chalk.bold.green("DBH-DEBUG: " + pString));
        } else {
            // log obvious, shameful mistake
            console.log(chalk.bold.red("_dbhDebugLog : bad parameter !"));
            console.log(chalk.red("pString : type = " + typeof pString + ", value = " + pString));
        }
    }
};
