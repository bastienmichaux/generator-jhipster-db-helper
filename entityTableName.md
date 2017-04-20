# EntityTableName
This document explains where JHipster entity generator handles the entityTableName and what it does to it.
Then it explains what removing the value's processing does and how it could actually works.

## Documentation on the variable entityTableName inside `generators/entity`

The variable `entityTableName` is the one used for the ORM's table name.
It is thus vital to understand its usage to be able to map an existing database.

### Assignement from prompt

`this.entityTableName = this.getTableName(this.options['table-name'] || this.name);`
Recover prompt's answer or option `table-name` parameter if invoked and **processes it**.
**This is an unwanted behavior.**

### Assignement from configuration file

If .jhipster/Entity.json exists, it will be used and the user won't be prompted.
If such is the case, the entityTableName is retrieved from the "entityTableName" field. This value won't be processed.
If it doesn't exist, it uses the entity name after processing it.

### Validation 

The tableName goes through a two steps validation.
If it gets the value from the option `table-name` or loads it from the configuration file, it doesn't go through the first step.
This is because it means it doesn't derive table name from field name.
The first step checks special characters, emptyness, ending with 'Detail' and Java or JHipster keyword.
The second step checks special characters, emptyness and length for Oracle databases.

### Writing

Store entityTableName into a data object before using this object to create a .json file.

### Other entity

Similarly to the assignment from configuration file, it reads needed information for each relationship from other party json file.
If needed information is not found, it will get and process the entity name as a fallback.

## Tests after modification of the option `table-name`
This test shows what fails when you do the following modification :

```
this.entityTableName = this.getTableName(this.options['table-name'] || this.name);
```
replaced by 
```
this.entityTableName = this.options['table-name'] || this.getTableName(this.name);
```

This protects the value passed through the option from unwanted processing.

### Test's data

Let's create two entities : 
1. `$ yo jhipster:entity author --table-name EllaAuthor_SUF`
1. `$ yo jhipster:entity book --table-name EllaBook_SUF`

### Resulting ORM

For the entity **Author** we get `@Table(name = "EllaAuthor_SUF")`. And for the entity **Book** we have `@Table(name = "EllaBook_SUF")`.

### Test's result

`$ mvn -e test` informs us that it didn't go well : `Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing table [ella_author_suf]`.

### Conclusion

We learned that this option purpose is not to bypass the SpringNamingStrategy.
More importantly, we learned that the NamingStrategy is something deeply anchored inside JHipster and that it would be counter productive to try to modify this behaviour.

## An applicable solution

Rather than modifying values from inside JHipster, it is more wise to do so outside.
We'll thus make it happen inside a JHipster module and that is valid for table names, columns names and relationship names.
