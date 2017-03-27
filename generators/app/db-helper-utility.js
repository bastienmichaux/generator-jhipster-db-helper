"use strict";

// utility functions for generator-jhipster-db-helper

/**
 * TODOS : keep our TODOS here
 * - Write proper JsDoc
 * - Replace 'console.log' with 'this.log'
 */

const chalk = require('chalk');
const replace = require('replace');
const fs = require('fs');

// The following assumes that the pertinent configuration files are there and with these current naming strategy.
// this is true with jhipster v4.1.1
const filesWithNamingStrategyPaths = ["./pom.xml", "./src/main/resources/config/application.yml", "./src/test/resources/config/application.yml"];

module.exports = {

    // use this function as a DEBUG logger
    debugLog : function (pString) {
        if (typeof pString === "string" && pString !== '') {
            console.log(chalk.bold.green("DBH-DEBUG: " + pString));
        } else {
            // log obvious, shameful mistake
            console.log(chalk.bold.red("debugLog : bad parameter !"));
            console.log(chalk.red("pString : type = " + typeof pString + ", value = " + pString));
        }
    },

    // return an object with the entity name and all variants :
    // name, tableName, entityTableName, etc
    getEntityNameVariations : function (pEntityName) {
        console.log(chalk.bold.red("getEntityNameVariations NOT IMPLEMENTED YET !"));
        return false;
    },

    // replace Spring naming strategies with more neutral ones
    replaceNamingStrategies : function () {
        // grab our files from the global space
        const files = filesWithNamingStrategyPaths;

        const physicalOld = "org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy";
        const physicalNew = "org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl";

        const implicitOld = "org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy";
        const implicitNew = "org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl";

        // check that each file exists
        files.forEach( function(path) {
            if (!fs.existsSync(path)) {
                throw new Error(path + " doesn't exist!");
            } else {
                console.log("File " + path + " exists");
            }
        });

        // replace the files
        replace({
            regex: physicalOld,
            replacement: physicalNew,
            paths: files,
            recursive: false,
            silent: true,
        });

        replace({
            regex: implicitOld,
            replacement: implicitNew,
            paths: files,
            recursive: false,
            silent: true,
        });
        

        return false;
    }
};
