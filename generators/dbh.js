const DBH_CONSTANTS = require('./dbh-constants');
const fs = require('fs');


/** return the content of .yo-rc.json as a JSON object */
const getApplicationConfig = () => new Promise((resolve, reject) => {
    const appConfigFile = DBH_CONSTANTS.applicationConfigFile;
    // if file exists, return its output as a JSON object
    if (fs.existsSync(appConfigFile)) {
        fs.readFile(appConfigFile, 'utf8', (err, data) => {
            if (err) {
                throw new Error(err);
            }
            const applicationConfig = JSON.parse(data);
            if (applicationConfig) {
                resolve(applicationConfig);
            } else {
                reject(`getApplicationConfig: no output. Type: ${typeof applicationConfig}, value: ${applicationConfig}`);
            }
        });
    } else {
        throw new Error(`getApplicationConfig: file ${appConfigFile} not found`);
    }
});


/** assert parameter is a non-empty string */
const isTrueString = x => (typeof x === 'string' && x !== '');


module.exports = {
    getApplicationConfig,
    isTrueString
};
