# What is working ? 
Let's stop the regression ! This document notes what is working and what is failing. In the end, everything should be tested between each build.

At the moment, the tests aren't automated...

## Base configuration

This is valid for JHipster 4.3 as of commit fff0e80

The app configuration : 
```json
{
  "generator-jhipster": {
    "promptValues": {
      "packageName": "com.mycompany.myapp",
      "nativeLanguage": "fr"
    },
    "jhipsterVersion": "4.3.0",
    "baseName": "baseName",
    "packageName": "com.mycompany.myapp",
    "packageFolder": "com/mycompany/myapp",
    "serverPort": "8080",
    "authenticationType": "session",
    "hibernateCache": "ehcache",
    "clusteredHttpSession": false,
    "websocket": false,
    "databaseType": "sql",
    "devDatabaseType": "h2Disk",
    "prodDatabaseType": "mysql",
    "searchEngine": "elasticsearch",
    "messageBroker": false,
    "serviceDiscoveryType": false,
    "buildTool": "maven",
    "enableSocialSignIn": false,
    "rememberMeKey": "0bc0d21a40bce8de5a671283b27a451843b9a339",
    "clientFramework": "angular1",
    "useSass": false,
    "clientPackageManager": "yarn",
    "applicationType": "monolith",
    "testFrameworks": [
      "cucumber"
    ],
    "jhiPrefix": "jhi",
    "enableTranslation": true,
    "nativeLanguage": "fr",
    "languages": [
      "fr",
      "en"
    ]
  }
}
```

The entity Author
```json
{
    "fluentMethods": true,
    "relationships": [],
    "fields": [
        {
            "fieldName": "name",
            "dbhColumnName": "Namae",
            "fieldType": "String"
        },
        {
            "fieldName": "birthDate",
            "dbhColumnName": "BD",
            "fieldType": "LocalDate"
        }
    ],
    "changelogDate": "20170418140037",
    "dto": "no",
    "service": "no",
    "entityTableName": "author",
    "dbhTableName": "Scribe",
    "pagination": "no"
}
```

The entity Book
```json
{
    "fluentMethods": true,
    "relationships": [],
    "fields": [
        {
            "fieldName": "name",
            "dbhColumnName": "Namae",
            "fieldType": "String"
        },
        {
            "fieldName": "birthDate",
            "dbhColumnName": "BD",
            "fieldType": "LocalDate"
        }
    ],
    "changelogDate": "20170418140037",
    "dto": "no",
    "service": "no",
    "entityTableName": "author",
    "dbhTableName": "Scribe",
    "pagination": "no"
}
```

## Procedure
To test if it works :

1. `mvn clean`
1. `mvn test`
1. `./mvnw`
1. `gulp`
1. log in as admin:admin (on the page gulp just opened)
1. Add an author (say {"Adrien Horgnies", 1992-03-04})
1. Add a book (say {"Sea's teeth", "A sharp book", 2001-05-28, 9.99})

A working application shouldn't print any exception in the logs, nor there shouldn't be any error message on the web page and the two entries should be correctly inserted.

## Tests list

* From a blank application
	* [x] Add our module - fff0e80
	* [x] Call our module - fff0e80
	* [x] Regenerate the app - fff0e80
	* [x] Add an entity without any field and keep the default - fff0e80
	* [x] Add fields and keep the defaults - fff0e80
	* [x] Regenerate the entity and change dbhTableName - fff0e80
	* [x] Regenerate the entity and change dbhColumnName - fff0e80
	* [x] Add a second entity without any field and keep the default - fff0e80
	* [x] Add fields and keep the defaults - fff0e80
	* [x] Regenerate the entity and change dbhTableName - fff0e80
	* [x] Regenerate the entity and change dbhColumnName - fff0e80
* Already generated applications with two existing entities without any relation
	* [ ] Adding our module
	* [ ] regenerating the app with our module
	* [ ] modifying dbhTableName
	* [ ] modifying dbhColumnName
