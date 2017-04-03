// modules used by the generator
const generator = require('yeoman-generator');
const chalk = require('chalk');


module.exports = generator.extend({
    // check current project state, get configs, etc
    initializing() {
        this._debugLog('fix-entity generator');
        this._debugLog('initializing');
    },

    // prompt the user for options
    prompting() {
        // DEBUG : log where we are
        this._debugLog('prompting');

        const done = this.async();

        // user interaction on module call goes here
        const prompts = [];

        // call the prompts
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        });
    },

    // other Yeoman run loop steps would go here :

    // configuring: Saving configurations and configure the project (creating .editorconfig files and other metadata files)

    // default: If the method name doesn't match a priority, it will be pushed to this group.

    // write the generator-specific files
    writing() {
        // DEBUG : log where we are
        this._debugLog('writing');
    },

    // Where conflicts are handled (used internally)
    // conflict() {}

    // run installation (npm, bower, etc)
    install() {
        // DEBUG : log where we are
        this._debugLog('install');
    },

    // cleanup, say goodbye
    end() {
        // DEBUG : log where we are
        this._debugLog('End of fix-entity generator');
    }
});
