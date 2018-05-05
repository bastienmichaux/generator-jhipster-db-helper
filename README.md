# generator-jhipster-db-helper

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Join the chat at https://gitter.im/generator-jhipster-db-helper/Lobby][gitter-img]][gitter-url]

This is a [JHipster](http://jhipster.github.io/) module, meant to be used in a JHipster application.

JHipster was created with the purpose to generate pristine new applications.
It enforces conventions which make it hard to use it with messy existing databases.
However some of us still want create to JHipster applications with such databases.
`generator-jhipster-db-helper` makes it easy.

## Usage

1. Install our module from JHipster Marketplace or using your favourite package manager.

`yarn add generator-jhipster-db-helper`

2. Run the main generator on your already created JHipster application.

`yo generator-jhipster-db-helper`

3. Answer our module's questions after creating or regenerating an entity

![dbh-1 1 0-demo-questions][dbh-1 1 0-demo-questions]

Our module do all the necessary modifications (see below some of them)

![dbh-1 1 0-demo-entity-git-diff][dbh-1 1 0-demo-entity-git-diff]

4. Profit

Check [this application][demo-app] to see all the modifications our module do or check our [notes](whatAndWhy.md) for details.

## Installation

### Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

Create a new JHipster app and choose a SQL database.

### With Yarn

To install this module: `yarn global add generator-jhipster-db-helper`

To update this module: `yarn global upgrade generator-jhipster-db-helper`

### With NPM

To install this module: `npm install -g generator-jhipster-db-helper`

To update this module: `npm update -g generator-jhipster-db-helper`

## How this module works

Upon running the main generator, it changes the naming convention to a more flexible one, registers itself as a post app hook and registers the 'fix-entity' sub-generator as a post-entity hook.

When you create or regenerate an entity, the sub-generator `fix-entity` will after `jhipster:entity` has finished running.
It receives information from `jhipster:entity` and uses it to find out what must modified.

It asks the user what values it must use as replacements for the entity and liquibase files with.
It offers jhipster default values or user previous values if any as default answers.

It then match correspond values and replaces them with user input using regexes.

It stores your answer in the entity configuration file (`.jhipster/Entity.json`) and makes the necessary replacements in both ORM and changelog files.

## Contributing

### Development

1. Set up your local copy
	1. Fork this module
	2. Clone your fork on your working machine
	3. Install dependencies by running `yarn`
	4. Create a branch from master (see section Branching below)
	5. Develop new stuff
2. Use your local copy
	1. Register your local copy by running `yarn link` inside your clone directory
	2. Create an application to test your modifications
	3. Link the application with your local copy by running `yarn link generator-jhipster-db-helper` inside your application directory
	4. Use the module (see section Usage above)

You can edit your local repository and test the changes in the application directly.
There is no need to rebuild the app.

An **easy way** to get an application with many entities and all relationship types is to:
1. Copy the whole `travis` directory.
2. Edit the script `run-test-case.sh` to modify `JHIPSTER_VERSION` variable.
3. Run the script from the `travis` directory, not the `test-case` directory.
4. The application will be created inside the `test-case`

### Branching

When submitting changes, please do so from a new branch, **not the master branch**.
Please name your branch according these rules : 
* descriptive name : `fork` is bad, `bugfix/entity-name-validation` is good.
* all characters must be lowercase
* use dash `-` as a word separator.
* use a prefix to describe the branch's type :
    * `feature/` : New thing or improvement
    * `bugfix/xx-` : Repairing something that wasn't working correctly
    	* replace xx with the number of the issue. Always open an issue about discovered bugs.
    
### Integration testing
    
We use Travis CI for integration testing.
If you want our module to support another type of database, another application configuration or another set up
 of entities, the first thing you should do is adding your test case to the travis build.
 
### General guidelines
    
We aligned ourselves on the guidelines of `jhipster/generator-jhipster`, if you don't know them, please read [them][contributing-guidelines].

## Contact

[![Join the chat at https://gitter.im/generator-jhipster-db-helper/Lobby][gitter-img]][gitter-url]

## License

Apache-2.0 ©
Adrien Horgnies & Bastien Michaux


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-db-helper.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-db-helper
[travis-image]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper.svg?branch=master
[travis-url]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper
[daviddm-image]: https://david-dm.org/bastienmichaux/generator-jhipster-db-helper.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bastienmichaux/generator-jhipster-db-helper
[gitter-url]: https://gitter.im/generator-jhipster-db-helper/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter-img]: https://badges.gitter.im/generator-jhipster-db-helper/Lobby.svg

[demo-app]:https://github.com/AdrienHorgnies/jhipster-with-db-helper/compare/0cd0d00...141151f
[dbh-1 1 0-demo-questions]:https://user-images.githubusercontent.com/7291317/39645987-40128d16-4fda-11e8-85b4-6e9dc35a7605.png
[dbh-1 1 0-demo-entity-git-diff]:https://user-images.githubusercontent.com/7291317/39645986-3fe97e08-4fda-11e8-93db-164c909d8fe3.png

[contributing-guidelines]:https://github.com/jhipster/generator-jhipster/blob/master/CONTRIBUTING.md

