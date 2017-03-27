"use strict";

// utility functions for generator-jhipster-db-helper

const chalk = require('chalk');

module.exports = {


    // use this as a DEBUG logger
    _dbhDebugLog : function (pString) {
        if (typeof pString === "string" && pString !== '') {
            console.log(chalk.bold.green("DEBUG : " + pString));
        } else {
            // log obvious, shameful mistake
            console.log(chalk.bold.red("_dbhDebugLog : bad parameter !"));
            console.log(chalk.red("pString : type = " + typeof pString + ", value = " + pString));
        }
    }
};
