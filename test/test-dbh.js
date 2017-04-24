const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const dbh = require('../generators/dbh.js');

const expectedAppConfig = {
    "generator-jhipster": {
        "baseName": "sampleMysql",
        "packageName": "com.mycompany.myapp",
        "packageFolder": "com/mycompany/myapp",
        "authenticationType": "session",
        "hibernateCache": "ehcache",
        "clusteredHttpSession": "no",
        "websocket": "no",
        "databaseType": "sql",
        "devDatabaseType": "h2Disk",
        "prodDatabaseType": "mysql",
        "searchEngine": "no",
        "useSass": false,
        "buildTool": "maven",
        "frontendBuilder": "grunt",
        "enableTranslation": true,
        "enableSocialSignIn": false,
        "rememberMeKey": "2bb60a80889aa6e6767e9ccd8714982681152aa5",
        "testFrameworks": [
            "gatling"
        ]
    }
};

describe('Dbh', function () {
    it('pending tests');
});
