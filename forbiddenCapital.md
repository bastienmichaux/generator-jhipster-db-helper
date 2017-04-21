# Forbidden capital

The JHipster entity generator prevents the user from using a capital as a first letter.
The purpose of these tests is to see how we can change that behavior without breaking anything.
But first we'll do break things, see what's broken and how to repair it.

## Modus operandi

I will repeat this action's sequence and take note of unexpected events and write down the general behaviour.

0. Doing a modification
1. Generating an entity 
2. Checking generated resources : `java/domain/Entity.java` & `.jhipster/Entity.json`
3. Running unit tests : `mvn -e test`
4. Commiting changes
5. Running the application : `./mvnw` & `gulp`
6. Testing CRUD on the newly created entity and observing the terminal

## Generating an entity before any modification

We create an entity as usual to use it as a point of comparison ("fieldName": "field").

## Removing the relevant validation rule

I removed the validation rule from `entity/prompts.js` so the user can enter a capital as first letter.
Doing so without entering a first letter capital doesn't change anything, it's only a validation.

Now, entering a first letter capital for a field is another story.
While the ORM kept the capital for the variable name and its constructor, it didn't use it for the annotation.
This is more or less the opposite of what we wanted.

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
Then we can replace unwanted values (@Column) ourself and target only the relevant variables.

