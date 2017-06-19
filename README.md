# generator-jhipster-db-helper

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Join the chat at https://gitter.im/generator-jhipster-db-helper/Lobby][gitter-img]][gitter-url]

This JHipster module makes mapping on an existing database easier.
If you're not aware of the difficulties of using an existing database with JHipster, read [this](whatAndWhy.md)

## quick start

**Step one** : Answer questions after creating or regenerating an entity

![the questions this module will ask for a given entity 'Book'][demo-picture]

**Step two** : Let our module do all the necessary modifications (see here some of them)

![the modifications this module will do in the JPA file for a given entity][demo-jpa-picture]

**Step three** : Profit

Check [this application][demo-app] to see all the modifications our module do or check our [notes](whatAndWhy.md) for details.

## New feature or supporting a new set up

We've made as easy as possible to contribute to our project, come and join the fun !

To contribute to this project, please read [the contributing section](#contributing).

## Introduction

This is a [JHipster](http://jhipster.github.io/) module, meant to be used in a JHipster application.

It enables the user to input values corresponding to its existing database and inject them at the right places in the
 pertinent files automatically.
Without this module, you would have to modify each value by hand.
Count all your tables and your fields, sum everything, multiply by 2 or more (depending on the relationships) and this is
 the number of modifications this module will spare you.

## Usage

Generate an application with `yo jhipster`, run our module with `yo jhipster-db-helper` and you're done.
Our module will run as a post app/entity hook and you'll have to answer its questions.

Furthermore, you can use the option `--force` from Entity generator when generating an entity, provided that you have
 a configuration file including our module fields for this entity.
Our module will interpret the option and look for values into the corresponding entity configuration file rather than
 from user input.

So the following will work :

```shell
$ cat .jhipster/Developer.json
```

```json
{
    "fluentMethods": true,
    "relationships": [
        {
            "relationshipName": "beverage",
            "dbhRelationshipId": "beverage_id",
            "otherEntityName": "beverage",
            "relationshipType": "many-to-one",
            "otherEntityField": "name"
        },
        {
            "relationshipName": "bug",
            "dbhRelationshipId": "bugs_id",
            "otherEntityName": "bug",
            "relationshipType": "many-to-many",
            "otherEntityField": "analysis",
            "ownerSide": true,
            "otherEntityRelationshipName": "developer"
        },
        {
            "relationshipName": "mug",
            "otherEntityName": "mug",
            "relationshipType": "one-to-one",
            "ownerSide": false,
            "otherEntityRelationshipName": "developer"
        }
    ],
    "fields": [
        {
            "fieldName": "firstname",
            "dbhColumnName": "DB_Firstname",
            "fieldType": "String"
        },
        {
            "fieldName": "lastname",
            "dbhColumnName": "DB_Lastname",
            "fieldType": "String"
        },
        {
            "fieldName": "birthdate",
            "dbhColumnName": "DB_Birthdate",
            "fieldType": "LocalDate"
        }
    ],
    "changelogDate": "20170619101554",
    "dto": "no",
    "service": "no",
    "entityTableName": "DB_Developer",
    "pagination": "no",
    "dbhIdName": "DB_ID"
}
```

```shell
$ yo jhipster:entity Developer --force
```

Don't mind the field `"dbhRelationshipId"`. It's there so we can successfully match some values after regeneration.

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

This changes the naming convention to a more flexible one, registers itself as a post app hook and registers a 'fix-entity' sub-generator as a post-entity hook.

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

### Using your local version

Create your local working copy :

* Fork this module and create your local branch
* In the module folder, `yarn link`
* In an another, empty folder : `yo jhipster`
* In the new app folder **and for each new app** :
  * `yarn link generator-jhipster-db-helper`
  * `yo jhipster-db-helper`

You can edit your local repository and test the changes in the app. No need to rebuild the app.

### Branching

We work from the `dev` branch, **not** master.

When submitting, please do so from a new branch, not the master or dev one.
Please name your branch according these rules : 
* descriptive name : `fork` is bad, `bugfix/entity-name-validation` si good.
* all lowercase
* use dash `-` as a word separator.
* use a prefix to describe the branch's type :
    * `feature/` : New thing
    * `bugfix/` : Repairing something that wasn't working correctly
    * `fix/` : Improving something without modifying its behaviour
    
### Integration testing
    
We use Travis CI for integration testing.
If you want our module to support another type of database, another application configuration or another set up
 of entities, the first thing you should do is adding your test case.
 
We've set up conventions and helper scripts.
You **don't even need to know our conventions** if you use our scripts.
Please, go [check it out][travis-doc].
    
### General guidelines
    
We also use the same guidelines as `jhipster/generator-jhipster`, if you don't know it, please read [this](CONTRIBUTING.md).

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

[demo-picture]:https://cloud.githubusercontent.com/assets/7291317/25616627/40ffe10a-2f3e-11e7-832e-b04ec645a48c.png
[demo-JPA-picture]:https://cloud.githubusercontent.com/assets/7291317/25616642/53d92f7a-2f3e-11e7-9794-a4d7131ad8a9.png
[demo-app]:https://github.com/AdrienHorgnies/jhipster-with-db-helper/compare/0cd0d00...141151f

[travis-doc]:travis/travis-readme.md
