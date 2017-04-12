const DBH_CONSTANTS = require('./dbh-constants');
const fs = require('fs');


/** return the content of .yo-rc.json as a JSON object */
const getAppConfig = path => new Promise((resolve, reject) => {
    const appConfigFile = path;
    // if file exists, return its output as a JSON object
    if (fs.existsSync(appConfigFile)) {
        fs.readFile(appConfigFile, 'utf8', (err, data) => {
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
        throw new Error(`getAppConfig: file ${appConfigFile} not found`);
    }
});


/** assert parameter is a non-empty string */
const isTrueString = x => (typeof x === 'string' && x !== '');


module.exports = {
    getAppConfig,
    isTrueString
};
