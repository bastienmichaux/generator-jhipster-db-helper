# Notes

## JHipster and existing databases

JHipster is an amazing tool for developing new apps with empty databases. However it's harder to work with existing ones.

So, how do you make JHipster work in this scenario ?

You need to make several changes. Here are the issues we know about.

**Please tell us about issues we haven't covered yet !**

### 1 : Change the naming strategies 

Spring Boot has naming strategies that convert `camelCase` to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them :

1. Replace `org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy` with `hibernate.‌boot.model.naming.Ph‌ysicalNamingStrategy‌StandardImpl`
1. Replace `org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy` with `org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl`

### 2 : Modify the generated entities

There are several ways you can create entities with JHipster. The `jhipster:entity` is one of them. It walks you through the creation of an entity and produces several files.

If you are mapping on tables that already exist, you should always check that the entity files have the correct annotations.

In all tests we have done, `CamelCase` names are renamed to `underscore_case`.

If your DB has mixed naming conventions (it happens), you . This module will automate most of them.

### 3 : `--table-name` option

The `jhipster:entity` sub-generator has an option `--table-name`, so you can specify the actual table name for an entity.

But this option fails with `camelCase` names because they are still converted to `underscore_case`.

Let's say you created this entity :

```
$ yo jhipster:entity FooBar --table-name FooBarCamelCaseNotUnderscoreCasePlease
```

You still need to set the `@Table` annotation by yourself, because the entity file will look like this :

```java
//FooBar.java

/**
 * A FooBar.
 */
@Entity
@Table(name = "foo_bar_camel_case_not_underscore_case_please")
```

### 4 : Generate Liquibase changelog

Liquibase is a great tool : it's basically a version control for your DB. When you begin using Liquibase, you should use it every time you modify your DB schema.

When you begin working with JHipster, Liquibase registers changes to your DB
 schema. With an already existing database, you don't have an initial Liquibase file to store your initial schema. You need to create this initial file and test it against your existing DB. Liquibase is new for us, so **please contribute if you can help us with this subject**.

#### Use Liquibase with your existing DB :

With an already existing DB, Liquibase has 2 different recommendations :

1. The more reliable but harder approach is to register your DB in an initial changelog file. So you can rollback to this state if something goes wrong.
2. The easier but less reliable approach is to begin using Liquibase, but without an initial changelog file. It should be ok as long as you have a copy of the DB.
