# How does our travis build work ?

The main goal of our Travis configuration is to create a JHipster application with the test cases we support and run
 tests against that application.
 
## Entities

They are organized in a specific manner to ensure extensibility, maintainability and
 log readability.

### Automatic generation

You don't need to know the rules to add a new use case, just do this :
1. Create a jhipster application **with our module**
1. Create the entities you want in your use case
1. Run `$ import-mock-entities ~/my-jhipster-application`

That's it, you can stop reading this chapter :-D.

### The directory structure

All the entities used by the travis build are stored in the directory `travis/samples/entities`.

The directories and files must follow certain rules :
1. Each test case has its own directory inside `travis/samples/entities`
1. This directory name is composed with a unique three digits number following the previous test case, then some
 words describing the test case, with `-` as a word separator.
1. This directory contains all the entities the test case uses.
1. If you want to give more information about the test case, write it in `description.md`.
1. Any file without a `.json` extension will be ignored when loading the test case.


```
travis/samples/entities/
├── 000-only-table-name
│   ├── Beverage_000.json
│   ├── Bug_000.json
│   ├── Developer_000.json
│   ├── entities.conf
│   └── Mug_000.json
├── 001-table-with-fields
│   ├── Beverage_001.json
│   ├── Bug_001.json
│   ├── Developer_001.json
│   ├── entities.conf
│   └── Mug_001.json
└── 002-one-to-one-table-only
    ├── Beverage_002.json
    ├── Bug_002.json
    ├── Developer_002.json
    ├── entities.conf
    ├── Mug_002.json
    └── description.md
```

### The entity file name

The entity file name is such as `EntityName_xxx.json`.
This name respects these rules :

1. It ends with the extension `.json`.
1. It has a suffix, an underscore character followed by the test case identifying number.
1. For the main test, the name of the entity must be valid according to JHipster.

And of course, the name of the entity will be the same but without the extension.
