# generator-jhipster-db-helper
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

A JHipster module for already existing databases.

This module should make JHipster work with already existing databases.

We are interested by your contributions ! Check our [notes](notes.md) for details. Read [contributing][README.md#forking] to fork this module.

## Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

## Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

## Installation

### With Yarn

To install this module:

```bash
yarn global add generator-jhipster-db-helper
```

To update this module:

```bash
yarn global upgrade generator-jhipster-db-helper
```

### With NPM

To install this module:

```bash
npm install -g generator-jhipster-db-helper
```

To update this module:

```bash
npm update -g generator-jhipster-db-helper
```

## Contributing

1. Fork this module and create a new branch
1. In the module folder, type `yarn link`
1. Create a new JHipster app in an empty folder : `yo jhipster`
1. In the new app folder : `yarn link generator-jhipster-db-helper`
	* Yep it's quite a strokeful. Consider using an alias
1. In the new app folder : `yo jhipster-db-helper`
1. Answer the questions. The module should work.

If you have a bug, contact us at bastienmichaux@gmail.com.

## Usage

## License

Apache-2.0 © @bastienmichaux, @adrienHorgnies


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-db-helper.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-db-helper
[travis-image]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper.svg?branch=master
[travis-url]: https://travis-ci.org/bastienmichaux/generator-jhipster-db-helper
[daviddm-image]: https://david-dm.org/bastienmichaux/generator-jhipster-db-helper.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bastienmichaux/generator-jhipster-module
