/**
 * this module is used to replace missing properties
 * for the jhipsterVar and jhipsterFunc objects
 * see [issue #19](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/19) for the reason why we have to do this
 */

const path = require('path');
const DBH_CONSTANTS = require('./dbh-constants.js');
const fs = require('fs');

// these functions exist to replace jhipsterVar missing properties when testing
const getAppConfig = directory => new Promise((resolve, reject) => {
    // path to '.yo-rc.json'
    const path = directory + DBH_CONSTANTS.appConfigFile;

    // if file exists, return it as a JSON object
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(err));
            }
            const appConfigToJson = JSON.parse(data);

            // handle undefined object
            if (appConfigToJson) {
                resolve(appConfigToJson);
            } else {
                reject(new Error(`getAppConfig: no output. Type: ${typeof appConfigToJson}, value: ${appConfigToJson}`));
            }
        });
    } else {
        reject(new Error(`getAppConfig: file ${path} not found`));
    }
});

/** from a .yo-rc.json file, return the build tool */
const getAppConfigBuildTool = directory => {
    return getAppConfig(directory)
    .catch(err => console.log(err))
    .then(resolvedJsonObject => resolvedJsonObject["generator-jhipster"]["buildTool"]);
};

module.exports = {
    getAppConfig,
    getAppConfigBuildTool
};
