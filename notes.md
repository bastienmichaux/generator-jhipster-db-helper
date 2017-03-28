# Notes

## JHipster and existing databases

JHipster is an amazing tool for new apps with empty databases. However it's harder to work with existing ones.

In order to make JHipster work in this scenario, you need to do several changes.

The goal of this module is to automate all these changes using :

```
yo jhipster-db-helper
```

We cover the needed changes in this document. **Please tell us about issues we haven't covered yet !**

### 1 : Change the Spring naming strategies 

Spring Boot has naming strategies for your entity classes. They convert `camelCase` to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them with :

`hibernate.‌boot.model.naming.Ph‌ysicalNamingStrategy‌StandardImpl`

`org.hibernate.cfg.DefaultNamingStrategy`


### 2 : Modify the entity generator

The `jhipster:entity` sub-generator has an option `--table-name`, so you can specify the actual table name for an entity.

```
yo jhipster:entity FooBar --table-name Prefix_FooBar
```

But this option isn't useful in some cases, because JHipster still converts the table name to `underscore_case`.

If you use this option you need to check your files. That's something we'll automate too.

### 3 : Generate Liquibase changelog

Liquibase is a great tool : it gives you version control over your database schema.

JHipster generates Liquibase files. It's easy to do with greenfield projects.

But if you read this, you have an existing database. We aim to generate a Liquibase changelog that captures your DB at the time you begin using `jhipster-db-helper`.

Liquibase is new for us, so **please contribute if you can help us with this subject**.

#### Use Liquibase with an existing DB :

With an already existing DB, Liquibase has 2 different recommendations :

1. The more reliable but harder approach is to register your DB in an initial changelog file. So you can rollback to this state if something goes wrong.
2. The easier but less reliable approach is to begin using Liquibase without an initial changelog file. It should be ok as long as you have a copy of the DB.


