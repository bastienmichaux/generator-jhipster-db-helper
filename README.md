# generator-jhipster-db-helper
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

A JHipster module for already existing databases.

**This module is at an early stage, feedback is welcome ;)**

Check our [notes](notes.md) for details. Read the **contributing** section too in this document.

## Introduction

This is a [JHipster](http://jhipster.github.io/) module, meant to be used in a JHipster application.

## Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

## Installation

Create a new JHipster app and choose a SQL database. 

### With Yarn

To install this module: `yarn global add generator-jhipster-db-helper`

To update this module: `yarn global upgrade generator-jhipster-db-helper`

### With NPM

To install this module: `npm install -g generator-jhipster-db-helper`

To update this module: `npm update -g generator-jhipster-db-helper`

## What this module does

In a new app, run `generator-jhipster-db-helper`.

This will make some changes to your JHipster files. These changes make mapping on your existing database easier.

After creating a new entity (`jhipster:entity MyEntity`), this module asks you :

* what is the table name for your entity
* for each field, what is the column name

**Planned features** :

* import your database schema into JHipster and create entities
* relationship handling (not done yet)

## Contributing

* Fork this module and create your local branch
* In the module folder, `yarn link`
* Create a new JHipster app in an empty folder : `yo jhipster`
* In the new app folder :
  * `yarn link generator-jhipster-db-helper`
  * `yo jhipster-db-helper`
* Answer the questions. The module should work. You now have a working test app.
* Pull your changes to a new branch

You can edit your local repository and test the changes in the app. No need to rebuild or regen anything.

Check our [todo list](todo.md) and our [notes](NOTES.md). You can also contact us !

* Adrien : ahorgnies@altissia.com
* Bastien : bmichaux@altissia.com

## License

Apache-2.0 © and the JHipster contributors


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-db-helper.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-db-helper
[travis-image]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper.svg?branch=master
[travis-url]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper
[daviddm-image]: https://david-dm.org/bastienmichaux/generator-jhipster-db-helper.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bastienmichaux/generator-jhipster-module
