// modules used by the generator
const generator = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('./prompts.js')

module.exports = generator.extend({
    // check current project state, get configs, etc
    initializing() {
        this.log('fix-entity generator');
        this.log('initializing');
    },

    // prompt the user for options
    prompting: {
        askForTableName: prompts.askForTableName,
        askForColumnName: prompts.askForColumnName
    },

    // other Yeoman run loop steps would go here :

    // configuring: Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default: If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this.log('writing');
    },

    // Where conflicts are handled (used internally)
    // conflict() {}

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this.log('install');
    },

    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this.log('End of fix-entity generator');
    }
});
