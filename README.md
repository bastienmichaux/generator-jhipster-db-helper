# generator-jhipster-db-helper

[![NPM version][npm-image]][npm-url] <!-- [![Build Status][travis-image]][travis-url] --> [![Dependency Status][daviddm-image]][daviddm-url]

This JHipster module makes mapping on an existing database easier.
If you're not aware of the difficulties of using an existing database with JHipster, you can read [this](whatAndWhy.md)

1. Answer questions after creating or regenerating an entity :
![the questions this module will ask for a given entity 'Book'][demo-picture]
1. And let our module do all the necessary modifications (here are the differences for the JPA file) :
![the modifications this module will do in the JPA file for a given entity][demo-jpa-picture]

Check [this application][demo-app] to see all the modifications our module do or check our [notes](notes.md) for details.

To contribute to this project, please read [the contributing section first](#contributing).

## Introduction

This is a [JHipster](http://jhipster.github.io/) module, meant to be used in a JHipster application.
It enables the user to input values corresponding to its existing database and inject them at the right places in the pertinent files automatically.
Without this module, you would have to modify each value by hand.
Count all your tables and your fields, sum everything, multiply by 2 or more (depending on the relations) and this is the number of modifications this module will save you from.

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

## What this module does

In a new app, run `yo jhipster-db-helper`.

This changes the naming convention in favor of a more flexible one, register istself as a post app hook and register its sub-generator 'fix-entity' as a post entity hook.
These changes make mapping on your existing database possible.

After creating or regenerating an entity (`yo jhipster:entity MyEntity`), there will be two more questions :

* What is the table name for this entity ? (default)
* What column name do you want for the field "fieldName" ? (default)

The former is asked once, the latter once for each field.
It stores your answer in the entity configuration file (`.jhipster/Entity.json`) and makes the necessary replacements in both ORM and changelog files.

**Planned features** :

* Import your database schema into JHipster.
At the moment, you must create each entity yourself.
We plan to make the module able to import a database and create all entities itself, with correct table and column names of course.

## Contributing <a id="contributing"></a>

The detailed information is available [here](CONTRIBUTING.md)

Create your local working copy :

* Fork this module and create your local branch
* In the module folder, `yarn link`
* Create a new JHipster app in an empty folder : `yo jhipster`
* In the new app folder (You must do that for each new app !) :
  * `yarn link generator-jhipster-db-helper`
  * `yo jhipster-db-helper`

You can edit your local repository and test the changes in the app. No need to rebuild or regen anything.

When submitting, please do so from a new branch, not master.

Check our [notes](notes.md).

## Contact

[![Join the chat at https://gitter.im/generator-jhipster-db-helper/Lobby](https://badges.gitter.im/generator-jhipster-db-helper/Lobby.svg)](https://gitter.im/generator-jhipster-db-helper/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## License

Apache-2.0 ©
Adrien Horgnies & Bastien Michaux


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-db-helper.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-db-helper
[travis-image]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper.svg?branch=master
[travis-url]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper
[daviddm-image]: https://david-dm.org/bastienmichaux/generator-jhipster-db-helper.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bastienmichaux/generator-jhipster-module

[demo-picture]:https://cloud.githubusercontent.com/assets/7291317/25616627/40ffe10a-2f3e-11e7-832e-b04ec645a48c.png
[demo-JPA-picture]:https://cloud.githubusercontent.com/assets/7291317/25616642/53d92f7a-2f3e-11e7-9794-a4d7131ad8a9.png
[demo-app]:https://github.com/AdrienHorgnies/MTM_DBH/compare/e840b36...0811391
