# Forbidden capital

The JHipster entity generator prevents the user from using a capital as a first letter.
The purpose of these tests is to see how we can change that behavior without breaking anything.
But first we'll do break things, see what's broken and how to repair it.

## Modus operandi

I will repeat this action's sequence and take note of unexpected events and write down the general behavior.

0. Doing a modification
1. Generating an entity 
2. Checking generated resources : `java/domain/Entity.java` & `.jhipster/Entity.json`
3. Running unit tests : `mvn -e test`
4. Commiting changes
5. Running the application : `./mvnw` & `gulp`
6. Testing CRUD on the newly created entity and observing the terminal

## Generating an entity before any modification

> The entity name is 'first'.

We create an entity as usual to use it as a point of comparison.
As expected, everything went well. I created the entity :
```
{
    "fluentMethods": true,
    "relationships": [],
    "fields": [
        {
            "fieldName": "field",
            "fieldType": "String"
        }
    ],
    "changelogDate": "20170329073229",
    "dto": "no",
    "service": "no",
    "entityTableName": "first",
    "pagination": "no"
}
```
And added some entries without a problem.

## Removing the relevant validation rule

I removed the validation rule from `entity/prompts.js` so the user can enter a capital as first letter.
```
} else if (input.charAt(0) === input.charAt(0).toUpperCase()) {
    return 'Your field name cannot start with a upper case letter';
```

### Entry without first letter capital

> The entity name is 'second'.

But I won't enter a capital as first letter to begin with.
Generated .json and .java follow the same rules.
Everything seems fine.

### Entry **with** first letter capital

> The entity name is 'third'.

The entity configuration file did take the capital but not so the ORM : 
```
{
    "fluentMethods": true,
    "relationships": [],
    "fields": [
        {
            "fieldName": "Field",
            "fieldType": "String"
        }
    ],
    "changelogDate": "20170329084643",
    "dto": "no",
    "service": "no",
    "entityTableName": "third",
    "pagination": "no"
}
```

The generated ORM kept the capital for the variable name and its constructor,
but it didn't use it for the annotation.

```
package com.altissia.mymicroapi.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Third.
 */
@Entity
@Table(name = "third")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "third")
public class Third implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field")
    private String Field;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getField() {
        return Field;
    }

    public Third Field(String Field) {
        this.Field = Field;
        return this;
    }

    public void setField(String Field) {
        this.Field = Field;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Third third = (Third) o;
        if (third.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, third.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Third{" +
            "id=" + id +
            ", Field='" + Field + "'" +
            '}';
    }
}
```

It can only be expected that this won't work.
`mvn -e test` results in failed tests. Three of them fail, they're all below :
```java
-------------------------------------------------------------------------------
Test set: com.altissia.mymicroapi.web.rest.ThirdResourceIntTest
-------------------------------------------------------------------------------
Tests run: 10, Failures: 3, Errors: 0, Skipped: 0, Time elapsed: 0.447 sec <<< FAILURE! - in com.altissia.mymicroapi.web.rest.ThirdResourceIntTest
searchThird(com.altissia.mymicroapi.web.rest.ThirdResourceIntTest)  Time elapsed: 0.062 sec  <<< FAILURE!
java.lang.AssertionError: JSON path "$.[*].Field"
Expected: a collection containing "AAAAAAAAAA"
     but: 
	at org.hamcrest.MatcherAssert.assertThat(MatcherAssert.java:20)
	at org.springframework.test.util.JsonPathExpectationsHelper.assertValue(JsonPathExpectationsHelper.java:74)
	at org.springframework.test.web.servlet.result.JsonPathResultMatchers$1.match(JsonPathResultMatchers.java:86)
	at org.springframework.test.web.servlet.MockMvc$1.andExpect(MockMvc.java:171)
	at com.altissia.mymicroapi.web.rest.ThirdResourceIntTest.searchThird(ThirdResourceIntTest.java:252)

getAllThirds(com.altissia.mymicroapi.web.rest.ThirdResourceIntTest)  Time elapsed: 0.03 sec  <<< FAILURE!
java.lang.AssertionError: JSON path "$.[*].Field"
Expected: a collection containing "AAAAAAAAAA"
     but: 
	at org.hamcrest.MatcherAssert.assertThat(MatcherAssert.java:20)
	at org.springframework.test.util.JsonPathExpectationsHelper.assertValue(JsonPathExpectationsHelper.java:74)
	at org.springframework.test.web.servlet.result.JsonPathResultMatchers$1.match(JsonPathResultMatchers.java:86)
	at org.springframework.test.web.servlet.MockMvc$1.andExpect(MockMvc.java:171)
	at com.altissia.mymicroapi.web.rest.ThirdResourceIntTest.getAllThirds(ThirdResourceIntTest.java:146)

getThird(com.altissia.mymicroapi.web.rest.ThirdResourceIntTest)  Time elapsed: 0.034 sec  <<< FAILURE!
java.lang.AssertionError: No value at JSON path "$.Field", exception: No results for path: $['Field']
	at org.springframework.test.util.JsonPathExpectationsHelper.evaluateJsonPath(JsonPathExpectationsHelper.java:245)
	at org.springframework.test.util.JsonPathExpectationsHelper.assertValue(JsonPathExpectationsHelper.java:99)
	at org.springframework.test.web.servlet.result.JsonPathResultMatchers$2.match(JsonPathResultMatchers.java:99)
	at org.springframework.test.web.servlet.MockMvc$1.andExpect(MockMvc.java:171)
	at com.altissia.mymicroapi.web.rest.ThirdResourceIntTest.getThird(ThirdResourceIntTest.java:160)
```

Even if the tests failed, we can launch the application.
It won't exactly work thou.
We see through the browser that angular send the correct values.
We don't get any error but the insert doesn't work, we get a 'null' value everytime.
update gets the same result, delete works well as it works on id and we can't really know if select works fails as expected.
```
2017-03-29 11:24:37.393 DEBUG 9110 --- [  XNIO-2 task-8] c.a.m.aop.logging.LoggingAspect          : Enter: com.altissia.mymicroapi.web.rest.ThirdResource.createThird() with argument[s] = [Third{id=null, Field='null'}]
2017-03-29 11:24:37.393 DEBUG 9110 --- [  XNIO-2 task-8] c.a.mymicroapi.web.rest.ThirdResource    : REST request to save Third : Third{id=null, Field='null'}
Hibernate: insert into third (id, field) values (null, ?)
2017-03-29 11:24:37.556 DEBUG 9110 --- [  XNIO-2 task-8] c.a.m.aop.logging.LoggingAspect          : Exit: com.altissia.mymicroapi.web.rest.ThirdResource.createThird() with result = <201 Created,Third{id=1, Field='null'},{Location=[/api/thirds/1], X-forbiddenCapitalApp-alert=[forbiddenCapitalApp.third.created], X-forbiddenCapitalApp-params=[1]}>
```


## Conclusion

The field name is tightly link to many other properties and we can't just tweak it to get the wanted column name.
The only clean solution would be to directly build the wanted column name, using current and/or new user input.
Then we can replace unwanted values (@Column) ourself.

