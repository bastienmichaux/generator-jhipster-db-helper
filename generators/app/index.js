'use strict';
var yeoman = require('yeoman-generator');
// makes logs more beautiful
var chalk = require('chalk');
// gives access to the package.json data
//§ TODO : investigate __dirname
//§ WARN : this is hardcoded
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
//§ WARN: this is hard-coded and should have all needed data passed on at some point
var jhipsterVar = {moduleName: 'db-helper'};

// Stores JHipster functions
var jhipsterFunc = function () {
  this.log("Just used jhipsterFunc")
};


module.exports = yeoman.Base.extend({
  //check current project state, get configs, etc
  //TODO :  with a private function, validate the needed files before replacing
  initializing: {
    compose: function (args) {
      this.composeWith('jhipster:modules',
        {
          options: {
            jhipsterVar: jhipsterVar,
            jhipsterFunc: jhipsterFunc
          }
        },
        this.options.testmode ? {local: require.resolve('generator-jhipster/generators/modules')} : null
      );
    },
    displayLogo: function () {
      // Have Yeoman greet the user.
      this.log(
        chalk.bold('Welcome to the ' + chalk.red(packagejs.name) + ' generator! ' + chalk.yellow('v' + packagejs.version + '\n'))
      );
    }
  },

  //prompt the user for options :
  //- modify naming strategy (choose from a list ?)
  //- regenerate all entities ?
  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'message',
      message: 'Please put something',
      default: 'hello world!'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  //other Yeoman run steps : configuring, default

  //write the generator-specific files
  writing: {
    writeTemplates : function () {
      this.baseName = jhipsterVar.baseName;
      this.packageName = jhipsterVar.packageName;
      this.angularAppName = jhipsterVar.angularAppName;
      var javaDir = jhipsterVar.javaDir;
      var resourceDir = jhipsterVar.resourceDir;
      var webappDir = jhipsterVar.webappDir;

      this.message = this.props.message;

      this.log('baseName=' + this.baseName);
      this.log('packageName=' + this.packageName);
      this.log('angularAppName=' + this.angularAppName);
      this.log('message=' + this.message);

      //test writing files here
      this.template('dummy.txt', 'dummy.txt', this, {});
      this.template('README.md', 'README.md', this, {});    },

    registering: function () {
      try {
        jhipsterFunc.registerModule("generator-jhipster-db-helper", "entity", "post", "app", "A JHipster module for better interaction with an already existing database.");
      } catch (err) {
        this.log(chalk.red.bold('WARN!') + ' Could not register as a jhipster entity post creation hook...\n');
      }
    }
  },

  //run installation (npm, bower, etc)
  install: function () {
    this.installDependencies();
  },

  //cleanup, say goodbye
  end: function () {
    this.log('End of db-helper generator');
  }
});
