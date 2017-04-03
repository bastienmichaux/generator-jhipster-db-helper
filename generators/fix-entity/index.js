const generator = require('yeoman-generator');
const chalk = require('chalk');

const replace = require('replace');

const jhipsterVar = {
    moduleName: 'fix-entity '
};
const jhipsterFunc = {};

module.exports = generator.extend({
    initializing: {
        hello() {
            this.log(`${chalk.blue.bold('jhipster-db-helper')} post entity hook beginning \n`);
        },
        compose() {
            this.composeWith('jhipster:modules',
                { jhipsterVar, jhipsterFunc },
                this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
            );
        }
    },
    doThings() {
        this.log('Whole entity file');
        this.log(this.options.entityConfig);

        // As of now, I'll use EntityClass as a default entityTableName. This should be prompted
        jhipsterFunc.updateEntityConfig(this.options.entityConfig.filename, 'entityTableName', this.options.entityConfig.entityClass);
    },
    goodbye() {
        this.log(`${chalk.blue.bold('jhipster-db-helper')} post entity hook ended \n`);
    }
});
