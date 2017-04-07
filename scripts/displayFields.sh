#!/bin/bash

ls .jhipster/$1.json
cat .jhipster/$1.json | grep --color=always '"fieldName": ".*",'
echo

ls src/main/java/com/altissia/testapp/domain/$1.java
cat src/main/java/com/altissia/testapp/domain/$1.java | grep --color=always '@Column(name = ".*")'
echo

ls src/main/resources/config/liquibase/changelog/*_added_entity_$1.xml
cat src/main/resources/config/liquibase/changelog/*_added_entity_$1.xml | grep --color=always '<column name=".*" .*>' |grep -v '<column name="id" type="bigint" autoIncrement="${autoIncrement}">'
echo

