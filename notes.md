# Notes

This was written with JHipster v4.1.0 in mind.

## JHipster and existing databases

JHipster is an amazing tool for new apps with empty databases. However it's harder to work with existing ones.

So, how do you make JHipster work in this scenario? You need to do several changes. The goal of this module is to automate them.

**We may not be aware of all needed changes. Share your DB issues with us !**

### 1 : Change the Spring naming strategies 

Spring Boot has naming strategies for your entity classes. They convert `camelCase` to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them with :

1. Replace `org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy` with `hibernate.‌boot.model.naming.Ph‌ysicalNamingStrategy‌StandardImpl`
1. Replace `org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy` with `org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl`

### 2 : Modify the generated entities

You can create entities with `jhipster:entity`. The Java, Liquibase and web apps files are based on your input... Or are they ?

In all tests we have done, `CamelCase` input becomes `underscore_case`. It's goint to make your requests fail.

One of our goals is to bypass these renamings without breaking the app.

If your DB has mixed naming conventions, check that the entity files have the correct names.

**Capitalized field names** : `jhipster:entity` forbids capitalized field names. That's something you'll need to change in your files too.

### 3 : `--table-name` option

The `jhipster:entity` sub-generator has an option `--table-name`, so you can specify the actual table name for an entity.

...But `camelCase` names still become `underscore_case`.

Let's say you created this entity :

```
$ yo jhipster:entity FooBar --table-name FooBarCamelCasedNotUnderscoreCasedPlease
```

You still need to set the `@Table` annotation by yourself, because the entity file will look like this :

```java
//FooBar.java

/**
 * A FooBar.
 */
@Entity
@Table(name = "foo_bar_camel_cased_not_underscore_cased_please")
public class FooBar implements Serializable {
```

### 4 : Generate Liquibase changelog

Liquibase is a great tool : it gives you version control over your database schema.

JHipster generates Liquibase files. It's easy to do with greenfield projects.

But if you read this, you have an existing database. We aim to generate a Liquibase changelog that captures your DB at the time you begin using `jhipster-db-helper`.

Liquibase is new for us, so **please contribute if you can help us with this subject**.

#### Use Liquibase with an existing DB :

With an already existing DB, Liquibase has 2 different recommendations :

1. The more reliable but harder approach is to register your DB in an initial changelog file. So you can rollback to this state if something goes wrong.
2. The easier but less reliable approach is to begin using Liquibase without an initial changelog file. It should be ok as long as you have a copy of the DB.

### 5 : Import your database schema

We want to create a subgenerator that reads database schemas and creates all needed files.

You can do this with JHipster (using JDL and `jhipster:jdl-import`), but we still want to bypass the renaming and validation rules mentioned before.

