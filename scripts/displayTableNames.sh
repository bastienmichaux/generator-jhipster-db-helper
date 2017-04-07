#!/bin/bash

ls .jhipster/$1.json
cat .jhipster/$1.json | grep --color=always '"entityTableName": ".*",'
echo

ls src/main/java/com/altissia/testapp/domain/$1.java
cat src/main/java/com/altissia/testapp/domain/$1.java | grep --color=always '@Table(name = ".*")'
echo

ls src/main/resources/config/liquibase/changelog/*_added_entity_$1.xml
cat src/main/resources/config/liquibase/changelog/*_added_entity_$1.xml | grep --color=always '<createTable tableName=".*">'
echo

