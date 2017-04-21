# Make JHipster work with existing databases

(This was written with JHipster v4.1.1 in mind)

JHipster is an amazing tool for new apps with empty databases. However it's harder to work with existing ones, as it isn't what JHipster was designed for.

So, how do you make JHipster work in this scenario? You need to do several changes. This module automates most of them.

*We may not be aware of all needed changes. Correct us if something isn't covered !*

### 1 : Change the Spring naming strategies 

When creating an entity, Spring Boot converts `camelCase` names to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them with more neutral ones.

This module :

1. Replaces `org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy` with `hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl`
1. Replaces `org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy` with `org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl`

### 2 : Modify the generated entities

You can create entities with `jhipster:entity`. The entities are based on your input... Or are they ?

In the tests we made, `CamelCase` names becomes `underscore_case`. If your requests fail, you may need to :

1. regenerate the entity :
    * if it isn't done yet, initialise git to track the changes
    * add the `.jhipster/` directory and its files to git
    * in `.jhipster/FooBar.json`, set the value of `"entityTableName": "foo_bar"` to `"FooBar"`
    * in your terminal, type `yo jhipster:entity FooBar`, and select `Yes, regenerate the entity`
    * **tip** : select the `d` option to see what differences the regeneration makes to existing files
1. edit your Column names :
    * editing the field names in `.jhipster/FooBar.json` won't do any change to your entity files
    * find `FooBar.java` and edit the value of `@Column` for each field that isn't correctly mapped

You need to do this for every entity with `lowerCamelCase` or `UpperCamelCase` names.

One of our goals is to bypass these renamings without breaking the app, and automate the above steps.

**Capitalized field names** : `jhipster:entity` and the JDL language forbid capitalized field names. If your mapping needs it, set the values manually for your `@Column`.

**Acronyms** : beware, acronyms aren't always handled as you'd expect it. Eg:

 * `yo jhipster:entity FooBarAPISettings` gives you `@Table(name = "foo_barapisettings")`
 * if this entity has a field called `fooBarAPISettingsField`, the column annotation maps on `@Column(name = "foo_bar_api_settings_field")`

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
public class FooBar implements Serializable { ...
```

**Acronyms** : Same as above :

```
$ yo jhipster:entity FooBarAPISettings --table-name MyFooBarAPISettings
```

In `src/main/java/package/domain/MyFooBarAPISettings.java` :

```
@Table(name = "my_foo_barapisettings")
```

### 4 : Generate Liquibase changelog

Liquibase is a great tool : it gives you version control over your database schema.

JHipster generates Liquibase files for your empty DB. But if you read this, you have an existing DB and you need an initial changelog file that captures it, so you can rollback if something goes wrong.

**Use Liquibase with an existing DB :**

With an already existing DB, Liquibase has 2 different recommendations :

1. More reliable but harder : register your DB state in an initial changelog file with the [`liquibase generateChangeLog` command](http://www.liquibase.org/documentation/generating_changelogs.html). This process can become more complex depending on your DB state(s), preconditions, whether you already have ran changesets or not.
1. Easier but less reliable : begin using Liquibase without an initial changelog file. It should be ok as long as you have a backup tool to create your starting seed DB. Otherwise you won't be able to package and share your app.

When you begin using Liquibase, you should continue to use it every time you modify your DB schema.

If something goes wrong and your app uses Maven, you can compare DB states with :

```
mvn compile liquibase:diff
```

[More info on Liquibase Maven plugin here](http://www.liquibase.org/documentation/maven/maven_diff.html)

### 5 : Import your database schema

This is a planned feature. We want to create a subgenerator that imports database schemas and creates all needed files.

You can do this with JHipster (using JDL and `jhipster:jdl-import`), but we still want to bypass some of the renaming and validation rules mentioned before.

### Warning : regenerating the app

If you regenerate your JHipster app (`yo jhipster`), check all changes to the existing files. Otherwise, your app may cease to work as expected.

Regenerating the app will :

* initialise the Liquibase changelog
* initialise the cache configuration
* remove references to existing entities in your front-end and internationalization files

## Other documentation

These researchs and tests may have some interest for you.

* [What features are currently support](./integration.md)
* [Describe briefly the module, how to install and use it](./README.md)
* [How jhipster handles @Table inside the code](./entityTableName.md)
* [Our research and tests about the validation done on user input for a field](./forbiddenCapital.md)
* [Our to-do list !](./todo.md)
