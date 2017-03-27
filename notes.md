# Notes

## JHipster and existing databases

JHipster is an amazing tool for developing new apps with empty databases. However it's harder to work with existing ones. It's even harder if your databases mix `camelCase` and `underscore_case` names.

So, how do you make JHipster work in this scenario ? You need to make several changes. Here are the issues we know about.

**Please tell us about issues we haven't covered yet !**

### 1 : Change the naming strategies 

Spring Boot has naming strategies for your entity classes. They convert `camelCase` to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them with :

`hibernate.‌boot.model.naming.Ph‌ysicalNamingStrategy‌StandardImpl`

`org.hibernate.cfg.DefaultNamingStrategy`


### 2 : Modify the entity generator

The `jhipster:entity` sub-generator has an option `--table-name`, so you can specify the actual table name for an entity. But this option fails with `camelCase` names because JHipster still converts them to `underscore_case`.

### 3 : Generate Liquibase changelog

Liquibase is a great tool : it's basically a version control for your DB. When you begin using Liquibase, you should use it every time you modify your DB schema.

When you begin working with JHipster, Liquibase registers changes to your DB
 schema. With an already existing database, you don't have an initial Liquibase file to store your initial schema. You need to create this initial file and test it against your existing DB. Liquibase is new for us, so **please contribute if you can help us with this subject**.

#### Use Liquibase with your existing DB :

With an already existing DB, Liquibase has 2 different recommendations :

1. The more reliable but harder approach is to register your DB in an initial changelog file. So you can rollback to this state if something goes wrong.
2. The easier but less reliable approach is to begin using Liquibase, but without an initial changelog file. It should be ok as long as you have a copy of the DB.

More info at ...

### 4 : ?

There are further problems we will log here. Watch this repo for more info.
