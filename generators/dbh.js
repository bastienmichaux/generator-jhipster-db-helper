const DBH_CONSTANTS = require('./dbh-constants');
const fs = require('fs');


/** return the content of .yo-rc.json as a JSON object */
const getAppConfig = directory => new Promise((resolve, reject) => {
    const path = directory + DBH_CONSTANTS.appConfigFile;
    if (!isTrueString(path)) {
        throw new Error(`getAppConfig: bad parameter: ${typeof path} ${path})`);
    }
    // if file exists, return its output as a JSON object
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                throw new Error(err);
            }
            const appConfigToJson = JSON.parse(data);
            if (appConfigToJson) {
                resolve(appConfigToJson);
            } else {
                reject(`getAppConfig: no output. Type: ${typeof appConfigToJson}, value: ${appConfigToJson}`);
            }
        });
    } else {
        throw new Error(`getAppConfig: file ${path} not found`);
    }
});


/** assert parameter is a non-empty string */
const isTrueString = x => typeof x === 'string' && x !== '';


module.exports = {
    getAppConfig,
    isTrueString
};
