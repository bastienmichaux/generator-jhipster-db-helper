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
 words, with `-` as a word separator, describing the test case.
1. This directory contains all the entities the test case uses.
1. This directory can contain a markdown document to give more information about the test case. Its name should reflect
 the test case.
1. Any file without a `.json` extension will be ignored.


```
travis/samples/entities
├── 000-table-with-fields
│   ├── Beverage_000_A.json
│   ├── Bug_000_B.json
│   ├── Developer_000_C.json
│   └── Mug_000_D.json
├── 001-table-with-fields
│   ├── Beverage_001_A.json
│   ├── Bug_001_B.json
│   ├── Developer_001_C.json
│   └── Mug_001_D.json
└── 002-one-to-one
    ├── Beverage_002_A.json
    ├── Bug_002_B.json
    ├── Developer_002_C.json
    ├── Mug_002_D.json
    └── one-to-one.md
```

### The entity name

The entity name is such as `EntityName_xxx_AAA.json`. This name respects these rules :

1. It ends with the extension `.json`.
1. It has two suffixes :
    1. The first one is an underscore character followed by the test case identifying number.
    1. The second one is composed of capital letters which indicate the order in which the
     entity must be generated and will be removed before doing so, according to the suffix's 
     alphabetic order.
1. For the main test, name of the entity must be valid according to JHipster.
