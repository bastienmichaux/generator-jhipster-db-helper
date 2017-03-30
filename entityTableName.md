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

There is a two steps validation, one for the field name and one for the table name.
If it gets the value from the option `table-name` or loads it from the configuration file, it doesn't go through the first step.
This is because it means it doesn't derive table name from field name.
The first step checks special characters, emptyness, ending with 'Detail' and Java or JHipster keyword.
The second step checks special characters, emptyness and length for Oracle databases.

There are also validation rules specific to configuration file content and relationships I won't cover here.

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
becomes 
```
this.entityTableName = this.options['table-name'] || this.getTableName(this.name);
```
It means we protect the value passed through the option from unwanted processing.

### Test's data

#### Creation of the entity "author"
```
$ yo jhipster:entity author --table-name EllaAuthor_SUF

The entity author is being created.


Generating field #1

? Do you want to add a field to your entity? Yes
? What is the name of your field? name
? What is the type of your field? String
? Do you want to add validation rules to your field? No

================= Author =================
Fields
name (String) 


Generating field #2

? Do you want to add a field to your entity? Yes
? What is the name of your field? birthDate
? What is the type of your field? LocalDate
? Do you want to add validation rules to your field? No

================= Author =================
Fields
name (String) 
birthDate (LocalDate) 


Generating field #3

? Do you want to add a field to your entity? No

================= Author =================
Fields
name (String) 
birthDate (LocalDate) 


Generating relationships to other entities

? Do you want to add a relationship to another entity? Yes
? What is the name of the other entity? book
? What is the name of the relationship? book
? What is the type of the relationship? one-to-many
? What is the name of this relationship in the other entity? author

================= Author =================
Fields
name (String) 
birthDate (LocalDate) 

Relationships
book (Book) one-to-many 


Generating relationships to other entities

? Do you want to add a relationship to another entity? No

================= Author =================
Fields
name (String) 
birthDate (LocalDate) 

Relationships
book (Book) one-to-many 



? Do you want to use a Data Transfer Object (DTO)? No, use the entity directly
? Do you want to use separate service class for your business logic? No, the REST controller should use the repository directly
? Do you want pagination on your entity? No
```

#### Creation of the entity "book"
```
altissiadev@alt-adrienh:~/JHipster/26$ yo jhipster:entity book --table-name EllaBook_SUF

The entity book is being created.


Generating field #1

? Do you want to add a field to your entity? Yes
? What is the name of your field? title
? What is the type of your field? String
? Do you want to add validation rules to your field? No

================= Book =================
Fields
title (String) 


Generating field #2

? Do you want to add a field to your entity? Yes
? What is the name of your field? description
? What is the type of your field? String
? Do you want to add validation rules to your field? No

================= Book =================
Fields
title (String) 
description (String) 


Generating field #3

? Do you want to add a field to your entity? Yes
? What is the name of your field? publicationDate
? What is the type of your field? LocalDate
? Do you want to add validation rules to your field? No

================= Book =================
Fields
title (String) 
description (String) 
publicationDate (LocalDate) 


Generating field #4

? Do you want to add a field to your entity? Yes
? What is the name of your field? price
? What is the type of your field? BigDecimal
? Do you want to add validation rules to your field? No

================= Book =================
Fields
title (String) 
description (String) 
publicationDate (LocalDate) 
price (BigDecimal) 


Generating field #5

? Do you want to add a field to your entity? No

================= Book =================
Fields
title (String) 
description (String) 
publicationDate (LocalDate) 
price (BigDecimal) 


Generating relationships to other entities

? Do you want to add a relationship to another entity? Yes
? What is the name of the other entity? author
? What is the name of the relationship? author
? What is the type of the relationship? many-to-one
? When you display this relationship with Angular, which field from 'author' do you want to use? name
? Do you want to add any validation rules to this relationship? No

================= Book =================
Fields
title (String) 
description (String) 
publicationDate (LocalDate) 
price (BigDecimal) 

Relationships
author (Author) many-to-one 


Generating relationships to other entities

? Do you want to add a relationship to another entity? No

================= Book =================
Fields
title (String) 
description (String) 
publicationDate (LocalDate) 
price (BigDecimal) 

Relationships
author (Author) many-to-one 



? Do you want to use a Data Transfer Object (DTO)? No, use the entity directly
? Do you want to use separate service class for your business logic? No, the REST controller should use the repository directly
? Do you want pagination on your entity? No

Everything is configured, generating the entity...
```

### Resulting ORM

#### Author.java
```java
package com.altissia.test_app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Author.
 */
@Entity
@Table(name = "EllaAuthor_SUF")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "author")
public class Author implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Book> books = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Author name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public Author birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Set<Book> getBooks() {
        return books;
    }

    public Author books(Set<Book> books) {
        this.books = books;
        return this;
    }

    public Author addBook(Book book) {
        this.books.add(book);
        book.setAuthor(this);
        return this;
    }

    public Author removeBook(Book book) {
        this.books.remove(book);
        book.setAuthor(null);
        return this;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Author author = (Author) o;
        if (author.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, author.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Author{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", birthDate='" + birthDate + "'" +
            '}';
    }
}
```

#### Book.java
```java
package com.altissia.test_app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Book.
 */
@Entity
@Table(name = "EllaBook_SUF")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "book")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "price", precision=10, scale=2)
    private BigDecimal price;

    @ManyToOne
    private Author author;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Book title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Book description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public Book publicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
        return this;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Book price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Author getAuthor() {
        return author;
    }

    public Book author(Author author) {
        this.author = author;
        return this;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Book book = (Book) o;
        if (book.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, book.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Book{" +
            "id=" + id +
            ", title='" + title + "'" +
            ", description='" + description + "'" +
            ", publicationDate='" + publicationDate + "'" +
            ", price='" + price + "'" +
            '}';
    }
}

```

### Test's result

`$ mvn -e test` informs us that it didn't go well.

```java
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaAutoConfiguration.class]: Invocation of init method failed; nested exception is javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1628)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:555)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:483)
	at org.springframework.beans.factory.support.AbstractBeanFactory$1.getObject(AbstractBeanFactory.java:306)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:230)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:302)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:197)
	at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1081)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:856)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:542)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:737)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:370)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:314)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:120)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:98)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:116)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:83)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:189)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:131)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:230)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.createTest(SpringJUnit4ClassRunner.java:228)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner$1.runReflectiveCall(SpringJUnit4ClassRunner.java:287)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.methodBlock(SpringJUnit4ClassRunner.java:289)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:247)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:94)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.springframework.test.context.junit4.statements.RunBeforeTestClassCallbacks.evaluate(RunBeforeTestClassCallbacks.java:61)
	at org.springframework.test.context.junit4.statements.RunAfterTestClassCallbacks.evaluate(RunAfterTestClassCallbacks.java:70)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.run(SpringJUnit4ClassRunner.java:191)
	at org.apache.maven.surefire.junit4.JUnit4Provider.execute(JUnit4Provider.java:283)
	at org.apache.maven.surefire.junit4.JUnit4Provider.executeWithRerun(JUnit4Provider.java:173)
	at org.apache.maven.surefire.junit4.JUnit4Provider.executeTestSet(JUnit4Provider.java:153)
	at org.apache.maven.surefire.junit4.JUnit4Provider.invoke(JUnit4Provider.java:128)
	at org.apache.maven.surefire.booter.ForkedBooter.invokeProviderInSameClassLoader(ForkedBooter.java:203)
	at org.apache.maven.surefire.booter.ForkedBooter.runSuitesInProcess(ForkedBooter.java:155)
	at org.apache.maven.surefire.booter.ForkedBooter.main(ForkedBooter.java:103)
Caused by: javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.persistenceException(EntityManagerFactoryBuilderImpl.java:967)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:892)
	at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:60)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:353)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:370)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:359)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1687)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1624)
	... 41 common frames omitted
Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing table [ella_author_suf]
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.validateTable(AbstractSchemaValidator.java:121)
	at org.hibernate.tool.schema.internal.GroupedSchemaValidatorImpl.validateTables(GroupedSchemaValidatorImpl.java:42)
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.performValidation(AbstractSchemaValidator.java:89)
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.doValidation(AbstractSchemaValidator.java:68)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:191)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:72)
	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:309)
	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:445)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:889)
	... 47 common frames omitted
```
Une deuxième erreur :
```java
2017-03-21 10:45:32.176 ERROR 20217 --- [           main] o.s.test.context.TestContextManager      : Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener@41072572] to prepare test instance [com.altissia.test_app.repository.CustomSocialUsersConnectionRepositoryIntTest@1ddcc282]

java.lang.IllegalStateException: Failed to load ApplicationContext
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:124)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:83)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:189)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:131)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:230)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.createTest(SpringJUnit4ClassRunner.java:228)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner$1.runReflectiveCall(SpringJUnit4ClassRunner.java:287)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.methodBlock(SpringJUnit4ClassRunner.java:289)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:247)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:94)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.springframework.test.context.junit4.statements.RunBeforeTestClassCallbacks.evaluate(RunBeforeTestClassCallbacks.java:61)
	at org.springframework.test.context.junit4.statements.RunAfterTestClassCallbacks.evaluate(RunAfterTestClassCallbacks.java:70)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.run(SpringJUnit4ClassRunner.java:191)
	at org.apache.maven.surefire.junit4.JUnit4Provider.execute(JUnit4Provider.java:283)
	at org.apache.maven.surefire.junit4.JUnit4Provider.executeWithRerun(JUnit4Provider.java:173)
	at org.apache.maven.surefire.junit4.JUnit4Provider.executeTestSet(JUnit4Provider.java:153)
	at org.apache.maven.surefire.junit4.JUnit4Provider.invoke(JUnit4Provider.java:128)
	at org.apache.maven.surefire.booter.ForkedBooter.invokeProviderInSameClassLoader(ForkedBooter.java:203)
	at org.apache.maven.surefire.booter.ForkedBooter.runSuitesInProcess(ForkedBooter.java:155)
	at org.apache.maven.surefire.booter.ForkedBooter.main(ForkedBooter.java:103)
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaAutoConfiguration.class]: Invocation of init method failed; nested exception is javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1628)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:555)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:483)
	at org.springframework.beans.factory.support.AbstractBeanFactory$1.getObject(AbstractBeanFactory.java:306)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:230)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:302)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:197)
	at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1081)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:856)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:542)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:737)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:370)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:314)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:120)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:98)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:116)
	... 26 common frames omitted
Caused by: javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.persistenceException(EntityManagerFactoryBuilderImpl.java:967)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:892)
	at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:60)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:353)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:370)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:359)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1687)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1624)
	... 41 common frames omitted
Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing table [ella_author_suf]
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.validateTable(AbstractSchemaValidator.java:121)
	at org.hibernate.tool.schema.internal.GroupedSchemaValidatorImpl.validateTables(GroupedSchemaValidatorImpl.java:42)
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.performValidation(AbstractSchemaValidator.java:89)
	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.doValidation(AbstractSchemaValidator.java:68)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:191)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:72)
	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:309)
	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:445)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:889)
	... 47 common frames omitted
```

