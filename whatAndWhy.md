# Make JHipster work with existing databases

JHipster is an amazing tool for new apps with empty databases.
However it's harder to work with existing ones, as it isn't what JHipster was designed for.

JHipster forces the SpringNamingStrategy everywhere.
It is nice to get a clean and tidy database but what if it already exists which doesn't respect it (at all) ?

Well, it won't work, as simple as that.

So, how do you make JHipster work in this scenario? You need to do several changes. This module automates most of them.

### Validation

Some values that could be legal for a database aren't for JHipster as it would use its in a wider range.
Our module accepts such values as it only interacts with the database files.

### Change the Spring naming strategies 

When creating an entity, Spring Boot converts `camelCase` names to `underscore_case`. If you have a `FooBar` table, JHipster searches for `foo_bar` and your requests fail. Search for Spring's naming strategies and replace them with more neutral ones.

This module :

1. Replaces `org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy` with `hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl`
1. Replaces `org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy` with `org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl`

### Modify the generated entities

You can create entities with `yo jhipster:entity`. The entities are based on your input... Or are they ?

In the tests we made, `CamelCase` names becomes `underscore_case`.

As you do need the entities to reflect your input, you'll need to change values in each pertinent files : 
* configuration file - `.jhipster/myEntity.json`
* ORM - `src/main/java/com/mycompany/myapp/domain/myEntity.java`
* changelog for the entity - `src/main/resources/config/liquibase/changelog/DATE_added_entity_myEntity.xml`
* changelog(s) for the relationship(s) - `src/main/resources/config/liquibase/changelog/DATE_added_entity_constraints_myEntity.xml`

Jhipster will transform the columns names but not the table names.
You will thus have to do it yourself, for each field name which isn't hibernate snake case, at several occurences and it multiplies with relationships, yes, it does.

Our module eases this step by asking you what value you want when (re)generating an entity and doing all that itself.

It will store your answers in the configuration file of the entity and make the necessary replacements in the other files.

It keeps JHipster defaults values as much as possible.

It will only replace the annotations, reflect these changes in the liquibase files and, still in the liquibase files, changes the column id name for each relationships.

The latter is because JHipster was counting on Spring to apply the SpringNamingStrategy but we changed it so it won't work anymore.

### Import your database schema

This is a planned feature, we won't be happy until we have it.
We want our module to be able to feed on a database connection or an export (one or the two, not decided yet).

