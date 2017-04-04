const generator = require('yeoman-generator');
const chalk = require('chalk');

const replace = require('replace');
const fs = require('fs');

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
        // this.log(chalk.blue('Whole entity file'));
        // this.log(this.options.entityConfig);
        // this.log(chalk.blue('jhipsterVar'));
        // this.log(jhipsterVar);

        // TODO As of now, I'll use EntityClass as a default entityTableName. This value should be user input.
        let wantedValue = this.options.entityConfig.entityClass;
        let unwantedValue = this.options.entityConfig.entityTableName;

        let ORMFile = jhipsterVar.javaDir + '/domain/' + this.options.entityConfig.entityClass + '.java';

        if (fs.existsSync(ORMFile)) {
            this.log(`File ${chalk.cyan(ORMFile)} exists`);
            let prefix = '@Table\\(name = "';
            let suffix = '"\\)';

            replace({
                regex: prefix + '.*' + suffix,
                replacement: prefix.replace('\\', '') + wantedValue + suffix.replace('\\', ''),
                paths: [ORMFile],
                recursive: false,
                silent: true,
            });
        } else {
            throw new Error(`${ORMFile} doesn't exist!`);
        }

        jhipsterFunc.updateEntityConfig(this.options.entityConfig.filename, 'entityTableName', wantedValue);
    },
    goodbye() {
        this.log(`${chalk.blue.bold('jhipster-db-helper')} post entity hook ended \n`);
    }
});
