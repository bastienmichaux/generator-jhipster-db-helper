# How does our travis build work ?

The main goal of our Travis configuration is to create a JHipster application with the test cases we support and run
 tests against that application.
 
## Entities

They are organized in a specific manner to ensure extensibility, maintainability and
 log readability.

### The directory structure

All the entities used by the travis build are stored in the directory `travis/samples/entities`.

The directories and files must follow certain rules :
1. Each test case has its own directory inside `travis/samples/entities`
1. This directory name is composed with a unique three digits number following the previous test case, then some
 words, with `-` as a word separator, describing the test case.
1. This directory contains all the entities the test case must use.
1. All the entities are composed with : 


```
travis/samples/entities
├── 000-naked-table
│   ├── Beverage_000_A.json
│   ├── Bug_000_B.json
│   ├── Developer_000_C.json
│   └── Mug_000_D.json
├── 001-dressed-table
│   ├── Beverage_001_A.json
│   ├── Bug_001_B.json
│   ├── Developer_001_C.json
│   └── Mug_001_D.json
└── 002-one-to-one
    ├── Beverage_002_A.json
    ├── Bug_002_B.json
    ├── Developer_002_C.json
    └── Mug_002_D.json
```
